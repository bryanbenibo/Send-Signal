"use client"

import { useActionState } from "react"
import { signup } from "@/actions/auth"
import Link from "next/link"

export default function SignupPage() {
  const [state, dispatch] = useActionState(signup, undefined)

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--sys-color-background)] text-[var(--sys-color-on-background)]">
      <div className="w-full max-w-md p-8 bg-[var(--sys-color-surface)] shadow-[var(--sys-effect-shadow-lg-0)] rounded-xl border border-[var(--sys-color-outline-variant)]">
        <h1 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold text-center mb-6">Create Your Account</h1>
        
        <form action={dispatch} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[var(--sys-font-text-sm-medium-font-size)]" htmlFor="companyName">Company Name</label>
            <input 
              id="companyName" 
              name="companyName" 
              type="text" 
              required 
              className="p-3 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--sys-color-primary-container)]"
              placeholder="Acme Corp" 
            />
            {state?.fieldErrors?.companyName && (
              <p className="text-[var(--sys-color-error)] text-[var(--sys-font-text-xs-regular-font-size)]">{state.fieldErrors.companyName[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[var(--sys-font-text-sm-medium-font-size)]" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="p-3 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--sys-color-primary-container)]"
              placeholder="you@company.com" 
            />
            {state?.fieldErrors?.email && (
              <p className="text-[var(--sys-color-error)] text-[var(--sys-font-text-xs-regular-font-size)]">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[var(--sys-font-text-sm-medium-font-size)]" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="p-3 bg-[var(--sys-color-surface)] border border-[var(--sys-color-outline-variant)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--sys-color-primary-container)]"
              placeholder="••••••••" 
            />
            {state?.fieldErrors?.password && (
              <p className="text-[var(--sys-color-error)] text-[var(--sys-font-text-xs-regular-font-size)]">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          {state?.error && !state.fieldErrors && (
            <p className="text-[var(--sys-color-error)] text-[var(--sys-font-text-sm-medium-font-size)]">{state.error}</p>
          )}

          <button 
            type="submit" 
            className="p-3 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-[var(--sys-font-text-sm-regular-font-size)]">
          Already have an account? <Link href="/login" className="text-[var(--sys-color-primary)] hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
