import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function AnalyticsPage() {
  const session = await auth()
  
  // Aggregate stats across all campaigns for the user
  const aggregation = await prisma.campaign.aggregate({
    where: { user_id: session?.user?.id },
    _sum: {
      total_sent: true,
      total_delivered: true,
      total_read: true,
      total_replied: true,
      total_converted: true,
      total_failed: true,
    }
  })

  // Calculate percentages safely
  const sent = aggregation._sum.total_sent || 0
  const delivered = aggregation._sum.total_delivered || 0
  const read = aggregation._sum.total_read || 0
  const replied = aggregation._sum.total_replied || 0

  const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 0
  const readRate = delivered > 0 ? Math.round((read / delivered) * 100) : 0
  const replyRate = read > 0 ? Math.round((replied / read) * 100) : 0

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[var(--sys-color-outline-variant)] pb-4">
        <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          System Analytics
        </h2>
        <div className="text-[var(--sys-font-text-sm-medium-font-size)] bg-[var(--sys-color-surface-dim)] px-4 py-2 border border-[var(--sys-color-outline-variant)] rounded-lg">
          Lifetime Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-medium-font-size)]">Delivery Rate</h3>
            <span className="text-2xl">📬</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[var(--sys-font-display-2xl-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">{deliveryRate}%</span>
          </div>
        </div>

        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-medium-font-size)]">Read Rate</h3>
            <span className="text-2xl">👀</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[var(--sys-font-display-2xl-bold-font-size)] font-bold text-[#10b981]">{readRate}%</span>
          </div>
        </div>

        <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-medium-font-size)]">Reply Rate</h3>
            <span className="text-2xl">💬</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[var(--sys-font-display-2xl-bold-font-size)] font-bold text-[var(--sys-color-primary)]">{replyRate}%</span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] shadow-[var(--sys-effect-shadow-xs)] rounded-xl p-8 min-h-64 flex flex-col items-center justify-center text-center">
        <h4 className="font-bold text-[var(--sys-font-text-xl-bold-font-size)] mb-4">Detailed Reports Comming Soon</h4>
        <p className="text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-lg-regular-font-size)] max-w-xl">
          More granular breakdown of activity over time by geography and segments will be available in future updates. 
          Use the overall pipeline statistics above to gauge the current effectiveness of your outreach.
        </p>
      </div>

    </div>
  )
}
