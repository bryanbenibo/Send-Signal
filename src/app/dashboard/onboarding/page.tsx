"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--sys-color-background)]">
      <div className="w-full max-w-2xl bg-[var(--sys-color-surface)] shadow-[var(--sys-effect-shadow-lg-0)] border border-[var(--sys-color-outline-variant)] rounded-xl p-10">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`h-2 flex-1 rounded-full ${s <= step ? "bg-[var(--sys-color-primary)]" : "bg-[var(--sys-color-outline-variant)]"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="text-center flex flex-col items-center animate-in fade-in">
            <div className="w-16 h-16 bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] rounded-full flex items-center justify-center text-2xl mb-6">👋</div>
            <h1 className="text-[var(--sys-font-display-md-bold-font-size)] font-bold mb-4">Welcome to Send Signal</h1>
            <p className="text-[var(--sys-font-text-lg-regular-font-size)] text-[var(--sys-color-on-surface-variant)] mb-8 max-w-md">
              You are minutes away from automating personalized WhatsApp outreach. Let's get your account set up.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in">
            <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold mb-2">Connect WhatsApp API</h2>
            <p className="text-[var(--sys-color-on-surface-variant)] mb-6">Link your WhatsApp Business account to start sending messages.</p>
            
            <div className="p-6 border border-[var(--sys-color-outline-variant)] rounded-xl flex flex-col gap-4 bg-[var(--sys-color-background)] text-center">
              <p className="font-medium text-[var(--sys-color-on-surface)]">Connect with Meta</p>
              <p className="text-sm text-[var(--sys-color-on-surface-variant)]">You will need access to your Meta Business Manager.</p>
              <button className="self-center mt-2 px-6 py-3 bg-[#1877F2] text-white font-medium rounded-lg hover:opacity-90">
                Continue with Facebook
              </button>
            </div>
            <div className="mt-4 text-center">
              <button onClick={nextStep} className="text-sm text-[var(--sys-color-on-surface-variant)] hover:underline">I'll do this later</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold mb-2">Import Your First Leads</h2>
            <p className="text-[var(--sys-color-on-surface-variant)] mb-6">Upload a CSV file containing your leads (e.g. from TikTok or Twitter).</p>
            
            <div className="border-2 border-dashed border-[var(--sys-color-outline)] rounded-xl p-12 text-center flex flex-col items-center justify-center bg-[var(--sys-color-surface-dim)] hover:bg-[var(--sys-color-surface-container)] cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">📁</div>
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-[var(--sys-color-on-surface-variant)] mt-1">CSV (max 5MB)</p>
            </div>
            <div className="mt-4 text-center">
              <button onClick={nextStep} className="text-sm text-[var(--sys-color-on-surface-variant)] hover:underline">Skip for now</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in">
            <h2 className="text-[var(--sys-font-display-sm-bold-font-size)] font-bold mb-2">Create Message Template</h2>
            <p className="text-[var(--sys-color-on-surface-variant)] mb-6">Draft your first personalized outreach message.</p>
            
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Template Name (e.g. Welcome Message)" 
                className="w-full p-3 border border-[var(--sys-color-outline-variant)] rounded-lg"
              />
              <div className="border border-[var(--sys-color-outline-variant)] rounded-lg overflow-hidden">
                <div className="bg-[var(--sys-color-surface-dim)] p-2 flex gap-2 border-b border-[var(--sys-color-outline-variant)]">
                  <button className="px-3 py-1 bg-white border border-[var(--sys-color-outline-variant)] rounded text-xs">{"{FirstName}"}</button>
                  <button className="px-3 py-1 bg-white border border-[var(--sys-color-outline-variant)] rounded text-xs">{"{CompanyName}"}</button>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Hi {FirstName}, thanks for signing up!"
                  className="w-full p-4 border-none outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center flex flex-col items-center animate-in fade-in">
            <div className="w-16 h-16 bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] rounded-full flex items-center justify-center text-2xl mb-6">🚀</div>
            <h1 className="text-[var(--sys-font-display-md-bold-font-size)] font-bold mb-4">You're All Set!</h1>
            <p className="text-[var(--sys-font-text-lg-regular-font-size)] text-[var(--sys-color-on-surface-variant)] mb-8 max-w-md">
              Let's head over to the dashboard so you can launch your first campaign.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-[var(--sys-color-outline-variant)]">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 font-medium text-[var(--sys-color-on-surface)] disabled:opacity-30"
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="px-6 py-3 font-medium bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] rounded-lg hover:opacity-90"
          >
            {step === 5 ? "Go to Dashboard" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  )
}
