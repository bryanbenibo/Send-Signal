"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/analytics", label: "Analytics" },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isActive
                ? "bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)]"
                : "text-[var(--sys-color-on-surface-variant)] hover:bg-[var(--sys-color-surface-container)] hover:text-[var(--sys-color-on-surface)]"
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
