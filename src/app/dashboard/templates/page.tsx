import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function TemplatesPage() {
  const session = await auth()
  const templates = await prisma.template.findMany({
    where: { user_id: session?.user?.id },
    orderBy: { updated_at: "desc" },
  })

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[var(--sys-color-outline-variant)] pb-4">
        <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          Message Templates
        </h2>
        <button className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded shadow hover:opacity-90 transition-opacity">
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full p-12 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] text-center">
            <div className="w-16 h-16 bg-[var(--sys-color-surface-dim)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
            <h3 className="text-[var(--sys-font-text-lg-bold-font-size)] font-semibold text-[var(--sys-color-on-surface)] mb-2">No Templates Yet</h3>
            <p className="text-[var(--sys-font-text-md-regular-font-size)] text-[var(--sys-color-on-surface-variant)] mb-6 max-w-md mx-auto">
              Create reusable templates with dynamic variables like {"{FirstName}"} to personalize your bulk outreach.
            </p>
            <button className="px-6 py-3 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded-lg hover:opacity-90 transition-opacity">
              Create First Template
            </button>
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl shadow-[var(--sys-effect-shadow-xs)] flex flex-col hover:border-[var(--sys-color-primary)] transition-colors cursor-pointer">
              <h3 className="text-[var(--sys-font-text-lg-bold-font-size)] font-bold text-[var(--sys-color-on-surface)] truncate mb-2">
                {template.name}
              </h3>
              <p className="text-[var(--sys-font-text-xs-regular-font-size)] text-[var(--sys-color-on-surface-variant)] mb-4">
                Version {template.version} • Updated <span suppressHydrationWarning>{new Date(template.updated_at).toLocaleDateString()}</span>
              </p>
              <div className="flex-1 bg-[var(--sys-color-surface-container)] rounded p-4 text-[var(--sys-font-text-sm-regular-font-size)] text-[var(--sys-color-on-surface-variant)] font-mono whitespace-pre-wrap border border-[var(--sys-color-outline-variant)]/50">
                {template.body.length > 100 ? `${template.body.substring(0, 100)}...` : template.body}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
