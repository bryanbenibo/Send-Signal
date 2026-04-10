import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// WhatsApp Webhook Verification
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // In production, matching the verify token from your Meta App Dashboard
  if (mode === 'subscribe' && token) {
    console.log('[WhatsApp Webhook] Verified')
    return new NextResponse(challenge, { status: 200 })
  } else {
    return new NextResponse('Forbidden', { status: 403 })
  }
}

// Inbound Messaging & Status updates
export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0]
      const changes = entry?.changes?.[0]
      const value = changes?.value

      // Messages received (Replies & Inbound)
      if (value?.messages) {
        const msg = value.messages[0]
        const fromNumber = msg.from
        const textPattern = msg.text?.body

        console.log(`[WhatsApp Webhook] Received message from ${fromNumber}: ${textPattern}`)

        if (textPattern) {
          // Lookup lead
          const lead = await prisma.lead.findFirst({
            where: { phone_number: fromNumber }
          })

          if (lead) {
             const lowerText = textPattern.toLowerCase().trim()
             const unsubWords = ['stop', 'unsubscribe', 'cancel', 'end', 'quit']

             if (unsubWords.includes(lowerText)) {
               // Enforce unsubscribe
               await prisma.lead.update({
                 where: { id: lead.id },
                 data: { unsubscribed: true, unsubscribed_at: new Date() }
               })

               await prisma.activityLog.create({
                 data: {
                   user_id: lead.user_id,
                   lead_id: lead.id,
                   event_type: "LEAD_UNSUBSCRIBED",
                   description: "Lead opted out via STOP keyword"
                 }
               })
             } else {
               // Record reply
               // Update latest outbound message status
               const lastMessage = await prisma.message.findFirst({
                 where: { lead_id: lead.id, direction: "OUTBOUND" },
                 orderBy: { sent_at: "desc" }
               })

               if (lastMessage) {
                 await prisma.message.update({
                   where: { id: lastMessage.id },
                   data: { status: "REPLIED", replied_at: new Date() },
                 })

                 if (lastMessage.campaign_id) {
                    await prisma.campaign.update({
                      where: { id: lastMessage.campaign_id },
                      data: { total_replied: { increment: 1 } }
                    })
                 }
               }
             }
          }
        }
      }

      // Status updates (Delivered, Read)
      if (value?.statuses) {
         const statusEvent = value.statuses[0]
         const wamid = statusEvent.id // whatsapp_message_id
         const statusType = statusEvent.status // e.g. "delivered", "read", "failed"

         console.log(`[WhatsApp Webhook] Status update for ${wamid}: ${statusType}`)

         const existingMsg = await prisma.message.findUnique({
           where: { whatsapp_message_id: wamid }
         })

         if (existingMsg) {
             const updateData: any = { status: statusType.toUpperCase() }
             if (statusType === "delivered") updateData.delivered_at = new Date()
             if (statusType === "read") updateData.read_at = new Date()
             if (statusType === "failed") {
                updateData.failed_at = new Date()
                updateData.failure_reason = statusEvent.errors?.[0]?.message || "Unknown error"
             }

             await prisma.message.update({
               where: { id: existingMsg.id },
               data: updateData
             })

             // Update analytics
             if (existingMsg.campaign_id) {
               if (statusType === "delivered") {
                 await prisma.campaign.update({
                   where: { id: existingMsg.campaign_id },
                   data: { total_delivered: { increment: 1 } }
                 })
               } else if (statusType === "read") {
                 await prisma.campaign.update({
                   where: { id: existingMsg.campaign_id },
                   data: { total_read: { increment: 1 } }
                 })
               }
             }
         }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
