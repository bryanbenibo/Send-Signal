import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function LeadsPage() {
  const session = await auth()
  const leads = await prisma.lead.findMany({
    where: { user_id: session?.user?.id },
    orderBy: { created_at: "desc" },
    take: 50,
  })

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[var(--sys-color-outline-variant)] pb-4">
        <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          Leads
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[var(--sys-color-outline)] text-[var(--sys-color-on-surface)] font-medium rounded shadow-sm hover:bg-[var(--sys-color-surface-container)] transition-colors">
            Add Manually
          </button>
          <button className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded shadow hover:opacity-90 transition-opacity">
            Import CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl overflow-hidden shadow-[var(--sys-effect-shadow-xs)] flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--sys-color-surface-dim)] text-[var(--sys-font-text-xs-semibold-font-size)] uppercase text-[var(--sys-color-on-surface-variant)]">
              <tr className="border-b border-[var(--sys-color-outline-variant)]">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Phone Number</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Added On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sys-color-outline-variant)] text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface)]">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-[var(--sys-color-on-surface-variant)] text-[var(--sys-font-text-md-regular-font-size)]">
                    No leads found. Start by importing a CSV.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[var(--sys-color-surface-container)] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      {lead.first_name ? `${lead.first_name} ${lead.last_name || ''}` : "Unknown"}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--sys-font-text-sm-regular-font-size)] font-medium">
                      {lead.phone_number}
                    </td>
                    <td className="px-6 py-4 text-[var(--sys-color-on-surface-variant)]">
                      {lead.source || "Manual"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[var(--sys-color-surface-dim)] border border-[var(--sys-color-outline-variant)] rounded-full text-[var(--sys-font-text-xs-semibold-font-size)] uppercase">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--sys-color-on-surface-variant)]">
                      <span suppressHydrationWarning>{new Date(lead.created_at).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-[var(--sys-color-surface-dim)] px-6 py-4 border-t border-[var(--sys-color-outline-variant)] flex items-center justify-between text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-on-surface-variant)]">
          <span>Showing {leads.length} leads</span>
        </div>
      </div>
    </div>
  )
}
