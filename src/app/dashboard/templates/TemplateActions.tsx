"use client"

import { useState } from "react"
import { createTemplate } from "@/actions/templates"
import { useRouter } from "next/navigation"

export default function TemplateActions() {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    body: "",
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    if (!formData.name.trim()) {
      setError("Template name is required")
      setIsSubmitting(false)
      return
    }
    
    if (!formData.body.trim()) {
      setError("Template body is required")
      setIsSubmitting(false)
      return
    }
    
    const result = await createTemplate(formData)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }
    
    setShowModal(false)
    setFormData({ name: "", body: "" })
    setIsSubmitting(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded shadow hover:opacity-90 transition-opacity"
      >
        Create Template
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--sys-color-surface)] rounded-xl p-6 w-full max-w-lg shadow-xl border border-[var(--sys-color-outline-variant)]">
            <h3 className="text-[var(--sys-font-text-lg-bold-font-size)] font-bold text-[var(--sys-color-on-surface)] mb-4">
              Create Message Template
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-[var(--sys-color-error-container)] border border-[var(--sys-color-error)] rounded-lg text-[var(--sys-color-on-error-container)] text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">Template Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Welcome Message"
                  className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)]"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">Message Body *</label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Hi {FirstName}, thanks for reaching out! How can we help you today?"
                  rows={6}
                  className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)] resize-none font-mono"
                />
                <p className="text-xs text-[var(--sys-color-on-surface-variant)] mt-1">
                  Use {"{VariableName}"} for dynamic placeholders
                </p>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--sys-color-outline)] text-[var(--sys-color-on-surface)] font-medium rounded-lg hover:bg-[var(--sys-color-surface-container)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
