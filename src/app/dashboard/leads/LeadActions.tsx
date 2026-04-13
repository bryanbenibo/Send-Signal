"use client"

import { useState, useRef } from "react"
import { addLead, importLeads } from "@/actions/leads"
import { useRouter } from "next/navigation"

export default function LeadActions() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    source: "",
  })
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const result = await addLead(formData)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }
    
    setShowAddModal(false)
    setFormData({ first_name: "", last_name: "", phone_number: "", source: "" })
    setIsSubmitting(false)
    router.refresh()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsSubmitting(true)
    const result = await importLeads(file)
    
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
    
    setIsSubmitting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 border border-[var(--sys-color-outline)] text-[var(--sys-color-on-surface)] font-medium rounded shadow-sm hover:bg-[var(--sys-color-surface-container)] transition-colors"
        >
          Add Manually
        </button>
        <label className="px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded shadow hover:opacity-90 transition-opacity cursor-pointer">
          {isSubmitting ? "Importing..." : "Import CSV"}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
        </label>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--sys-color-surface)] rounded-xl p-6 w-full max-w-md shadow-xl border border-[var(--sys-color-outline-variant)]">
            <h3 className="text-[var(--sys-font-text-lg-bold-font-size)] font-bold text-[var(--sys-color-on-surface)] mb-4">
              Add New Lead
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-[var(--sys-color-error-container)] border border-[var(--sys-color-error)] rounded-lg text-[var(--sys-color-on-error-container)] text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)]"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+1234567890"
                  className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)]"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--sys-color-on-surface)]">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Website, Referral"
                  className="p-2 border border-[var(--sys-color-outline-variant)] rounded-lg bg-[var(--sys-color-surface)] text-[var(--sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-color-primary)]"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--sys-color-outline)] text-[var(--sys-color-on-surface)] font-medium rounded-lg hover:bg-[var(--sys-color-surface-container)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[var(--sys-color-primary)] text-[var(--sys-color-on-primary)] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
