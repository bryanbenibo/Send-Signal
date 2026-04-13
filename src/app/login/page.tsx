"use client"

import { useActionState, useEffect, useState } from "react"
import { authenticate } from "@/actions/auth"
import Link from "next/link"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(authenticate, undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (typeof state === "string") {
      setErrorMessage(state)
    }
  }, [state])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--sys-color-background)] text-[var(--sys-color-on-background)]">
      <div className="w-full max-w-md p-8 bg-[var(--sys-color-surface)] shadow-[var(--sys-effect-shadow-lg-0)] rounded-xl border border-[var(--sys-color-outline-variant)]">
        <h1 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-center mb-6">Log In To Send Signal</h1>
        
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[var(--sys-font-text-sm-medium-font-size)]" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              disabled={isPending}
              className="p-3 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--sys-color-primary-container)] disabled:opacity-50"
              placeholder="you@company.com" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[var(--sys-font-text-sm-medium-font-size)]" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              disabled={isPending}
              className="p-3 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--sys-color-primary-container)] disabled:opacity-50"
              placeholder="••••••••" 
            />
          </div>

          {errorMessage && (
            <div className="p-4 bg-[var(--sys-color-error-container)] border border-[var(--sys-color-error)] rounded-lg">
              <p className="text-[var(--sys-color-on-error-container)] text-[var(--sys-font-text-sm-medium-font-size)] flex items-center gap-2">
                <span>⚠️</span>
                {errorMessage}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="p-3 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-6 text-center text-[var(--sys-font-text-sm-regular-font-size)]">
          Don't have an account? <Link href="/signup" className="text-[var(--sys-color-primary)] hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
