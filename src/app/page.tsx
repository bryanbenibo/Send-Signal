import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-6 bg-[var(--sys-color-surface)] border-b border-[var(--sys-color-outline-variant)]">
        <div className="text-[var(--sys-font-text-xl-bold-font-size)] font-bold text-[var(--sys-color-on-surface)]">
          Send Signal
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-[var(--sys-color-on-surface)] font-medium hover:underline">Log in</Link>
          <Link href="/signup" className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] rounded-lg font-medium hover:opacity-90 transition-opacity">Get Started</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center text-center px-4 py-24 bg-[var(--sys-color-background)]">
        <h1 className="text-[var(--sys-font-display-2xl-bold-font-size)] font-bold text-[var(--sys-color-on-background)] max-w-4xl tracking-tight leading-tight">
          Personalized WhatsApp Outreach at Scale.
        </h1>
        <p className="mt-6 text-[var(--sys-font-text-xl-regular-font-size)] text-[var(--sys-color-on-surface-variant)] max-w-2xl">
          Turn your cold social media leads into warm conversations. Import leads, create personalized templates, and launch scalable WhatsApp campaigns in minutes.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/signup" className="px-8 py-4 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] rounded-lg text-[var(--sys-font-text-lg-semibold-font-size)] font-semibold shadow hover:opacity-90 transition-opacity">
            Start Free Trial
          </Link>
        </div>
        
        <div className="mt-20 max-w-5xl w-full grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl">
            <h3 className="text-[var(--sys-font-text-lg-semibold-font-size)] font-semibold text-[var(--sys-color-on-surface)]">One-Click Import</h3>
            <p className="mt-2 text-[var(--sys-color-on-surface-variant)]">Easily import your leads via CSV and segment them by custom tags.</p>
          </div>
          <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl">
            <h3 className="text-[var(--sys-font-text-lg-semibold-font-size)] font-semibold text-[var(--sys-color-on-surface)]">Dynamic Templates</h3>
            <p className="mt-2 text-[var(--sys-color-on-surface-variant)]">Use variables to personalize every single message sent in bulk automatically.</p>
          </div>
          <div className="p-6 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-xl">
            <h3 className="text-[var(--sys-font-text-lg-semibold-font-size)] font-semibold text-[var(--sys-color-on-surface)]">Idempotent Sending</h3>
            <p className="mt-2 text-[var(--sys-color-on-surface-variant)]">Our background engine guarantees that leads are never messaged twice.</p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-[var(--sys-color-on-surface-variant)] bg-[var(--sys-color-surface)] border-t border-[var(--sys-color-outline-variant)]">
        &copy; {new Date().getFullYear()} Send Signal Inc.
      </footer>
    </div>
  )
}
