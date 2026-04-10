import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function CampaignsPage() {
  const session = await auth()
  const campaigns = await prisma.campaign.findMany({
    where: { user_id: session?.user?.id },
    orderBy: { created_at: "desc" },
    include: {
      template: true,
      _count: { select: { campaign_leads: true } }
    }
  })

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[var(--sys-color-outline-variant)] pb-4">
        <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          Campaigns
        </h2>
        <button className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded shadow hover:opacity-90 transition-opacity flex gap-2 items-center">
          <span>+</span> New Campaign
        </button>
      </div>

      <div className="bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl overflow-hidden shadow-[var(--sys-effect-shadow-xs)] flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--sys-color-surface-dim)] text-[var(--sys-font-text-xs-semibold-font-size)] uppercase text-[var(--sys-color-on-surface-variant)]">
              <tr className="border-b border-[var(--sys-color-outline-variant)]">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Recipients</th>
                <th className="px-6 py-4 font-semibold">Sent / Delivered</th>
                <th className="px-6 py-4 font-semibold">Total Reads</th>
                <th className="px-6 py-4 font-semibold">Added On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sys-color-outline-variant)] text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface)]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-regular-font-size)]">
                    No campaigns created yet. Build a template and add leads first!
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[var(--sys-color-surface-container)] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[var(--sys-color-on-surface)]">{campaign.name}</p>
                        <p className="text-[var(--sys-font-text-xs-regular-font-size)] text-[var(--sys-color-on-surface-variant)]">Template: {campaign.template?.name || 'Deleted'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 border rounded-lg text-[var(--sys-font-text-xs-semibold-font-size)] uppercase ${
                        campaign.status === "RUNNING" ? "bg-green-100 text-green-800 border-green-200" :
                        campaign.status === "COMPLETED" ? "bg-[var(--sys-color-surface-dim)] text-[var(--sys-color-on-surface-variant)] border-[var(--sys-color-outline-variant)]" :
                        "bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] border-[var(--sys-color-primary)]"
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--sys-font-text-sm-regular-font-size)]">
                      {campaign._count.campaign_leads}
                    </td>
                    <td className="px-6 py-4 text-[var(--sys-color-on-surface-variant)]">
                      {campaign.total_sent} / {campaign.total_delivered}
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--sys-color-primary)]">
                       {campaign.total_read}
                    </td>
                    <td className="px-6 py-4 text-[var(--sys-color-on-surface-variant)]">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
