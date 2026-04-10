import { auth, signOut } from "@/auth"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex h-screen bg-[var(--sys-color-background)] text-[var(--sys-color-on-background)] overflow-hidden">
      {/* Sidebar sidebar */}
      <aside className="w-64 bg-[var(--sys-color-surface)] border-r border-[var(--sys-color-outline-variant)] flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-[var(--sys-color-outline-variant)]">
            <h1 className="font-bold text-[var(--sys-font-text-xl-bold-font-size)] text-[var(--sys-color-on-surface)]">Send Signal</h1>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            <Link href="/dashboard" className="px-4 py-2 rounded font-medium text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]">
              Overview
            </Link>
            <Link href="/dashboard/leads" className="px-4 py-2 rounded font-medium text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]">
              Leads
            </Link>
            <Link href="/dashboard/templates" className="px-4 py-2 rounded font-medium text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]">
              Templates
            </Link>
            <Link href="/dashboard/campaigns" className="px-4 py-2 rounded font-medium text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]">
              Campaigns
            </Link>
            <Link href="/dashboard/analytics" className="px-4 py-2 rounded font-medium text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]">
              Analytics
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--sys-color-outline-variant)]">
          <div className="mb-4 px-4 py-2 text-[var(--sys-font-text-sm-regular-font-size)] text-[var(--sys-color-on-surface-variant)] truncate">
            {session?.user?.email}
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button className="w-full px-4 py-2 text-left text-[var(--sys-font-text-sm-medium-font-size)] text-[var(--sys-color-error)] rounded hover:bg-[var(--sys-color-error-container)] transition-colors">
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-[var(--sys-color-surface)] border-b border-[var(--sys-color-outline-variant)]">
          <div className="font-semibold text-[var(--sys-color-on-surface)]">Workspace</div>
          <div className="w-8 h-8 rounded-full bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] flex items-center justify-center font-bold">
            {session?.user?.email?.[0].toUpperCase() || "U"}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
