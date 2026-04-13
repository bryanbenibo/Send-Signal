import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function DashboardOverview() {
  const session = await auth()
  
  const stats = await prisma.$transaction([
    prisma.lead.count({ where: { user_id: session?.user?.id } }),
    prisma.campaign.count({ where: { user_id: session?.user?.id } }),
    prisma.message.count({ where: { user_id: session?.user?.id, status: "SENT" } }),
    prisma.message.count({ where: { user_id: session?.user?.id, status: "REPLIED" } })
  ])

  const [totalLeads, totalCampaigns, totalSent, totalReplies] = stats

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--sys-font-display-md-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          Welcome back
        </h2>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)]">
          <p className="text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface-variant)] uppercase tracking-wider mb-2">Total Leads</p>
          <p className="text-[var(--sys-font-display-xl-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">{totalLeads}</p>
        </div>
        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)]">
          <p className="text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface-variant)] uppercase tracking-wider mb-2">Active Campaigns</p>
          <p className="text-[var(--sys-font-display-xl-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">{totalCampaigns}</p>
        </div>
        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)]">
          <p className="text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface-variant)] uppercase tracking-wider mb-2">Messages Sent</p>
          <p className="text-[var(--sys-font-display-xl-bold-font-size)] font-bold text-[var(--sys-color-primary)]">{totalSent}</p>
        </div>
        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)]">
          <p className="text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface-variant)] uppercase tracking-wider mb-2">Replies</p>
          <p className="text-[var(--sys-font-display-xl-bold-font-size)] font-bold text-[#10b981]">{totalReplies}</p>
        </div>
      </div>

      {/* Activity Timeline Placeholder */}
      <div className="bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] p-8">
        <h3 className="text-[var(--sys-font-text-lg-bold-font-size)] font-semibold text-[var(--sys-color-on-surface)] mb-4">Recent Activity</h3>
        <ul className="space-y-4">
          <li className="text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-regular-font-size)] py-2 border-b border-[var(--sys-color-outline-variant)]/50">
            Account created for <span suppressHydrationWarning>{session?.user?.email}</span>
          </li>
          <li className="text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-regular-font-size)] py-2">
            Waiting for first campaign dispatch.
          </li>
        </ul>
      </div>
    </div>
  )
}
