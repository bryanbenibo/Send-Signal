import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Dummy WhatsApp sending function mapped to requirements
async function mockSendWhatsAppMessage(to: string, text: string) {
  // In production, this integrates with Meta's Official WhatsApp Cloud API
  console.log(`[WhatsApp API Mock] Sending to ${to}: ${text}`)
  return { success: true, messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }
}

export async function GET(req: Request) {
  // 1. Authenticate cron trigger (e.g. Vercel CRON secret)
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 2. Fetch pending campaign leads
    const pendingLeads = await prisma.campaignLead.findMany({
      where: {
        status: "PENDING",
        OR: [
          { scheduled_for: null },
          { scheduled_for: { lte: new Date() } }
        ]
      },
      include: {
        lead: true,
        campaign: { include: { template: true } },
      },
      take: 50 // process in batches
    })

    if (pendingLeads.length === 0) {
      return NextResponse.json({ status: "No pending messages." })
    }

    const results = []

    // 3. Process each lead
    for (const cl of pendingLeads) {
      if (!cl.campaign.template || cl.lead.unsubscribed) {
        // Skip
        await prisma.campaignLead.update({
          where: { id: cl.id },
          data: { status: cl.lead.unsubscribed ? "SKIPPED_UNSUBSCRIBED" : "SKIPPED_NO_TEMPLATE" }
        })
        continue
      }

      // Idempotency check: see if a message already exists for this lead+campaign
      const existingMessage = await prisma.message.findFirst({
        where: { campaign_id: cl.campaign_id, lead_id: cl.lead_id, direction: "OUTBOUND" }
      })

      if (existingMessage) {
        await prisma.campaignLead.update({
          where: { id: cl.id },
          data: { status: "SKIPPED_DUPLICATE" }
        })
        continue
      }

      // Render template (very basic placeholder replacement)
      let renderedText = cl.campaign.template.body
      renderedText = renderedText.replace(/\{FirstName\}/gi, cl.lead.first_name || "there")
      renderedText = renderedText.replace(/\{CompanyName\}/gi, cl.lead.custom_fields_json ? (cl.lead.custom_fields_json as any).company || "" : "")

      // Create message record (Queued)
      const message = await prisma.message.create({
        data: {
          user_id: cl.campaign.user_id,
          campaign_id: cl.campaign_id,
          lead_id: cl.lead_id,
          campaign_lead_id: cl.id,
          direction: "OUTBOUND",
          status: "QUEUED",
          queued_at: new Date(),
          rendered_body: renderedText,
          template_snapshot: { body: cl.campaign.template.body, name: cl.campaign.template.name }
        }
      })

      // Send to Whatsapp API
      await prisma.message.update({ where: { id: message.id }, data: { status: "SENDING", sending_at: new Date() } })
      
      try {
        const apiResponse = await mockSendWhatsAppMessage(cl.lead.phone_number, renderedText)
        
        if (apiResponse.success) {
           await prisma.$transaction([
             prisma.message.update({
               where: { id: message.id },
               data: { status: "SENT", sent_at: new Date(), whatsapp_message_id: apiResponse.messageId }
             }),
             prisma.campaignLead.update({
               where: { id: cl.id },
               data: { status: "COMPLETED", processed_at: new Date() }
             }),
             prisma.campaign.update({
               where: { id: cl.campaign_id },
               data: { total_sent: { increment: 1 } }
             })
           ])
           results.push({ id: message.id, status: "SENT" })
        }
      } catch (err: any) {
        await prisma.$transaction([
          prisma.message.update({
            where: { id: message.id },
            data: { status: "FAILED", failure_reason: err.message || "Unknown error" }
          }),
          prisma.campaignLead.update({
            where: { id: cl.id },
            data: { status: "FAILED", attempt_count: { increment: 1 }, last_attempt_at: new Date() }
          }),
           prisma.campaign.update({
             where: { id: cl.campaign_id },
             data: { total_failed: { increment: 1 } }
           })
        ])
        results.push({ id: message.id, status: "FAILED" })
      }
    }

    return NextResponse.json({ processed: pendingLeads.length, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
