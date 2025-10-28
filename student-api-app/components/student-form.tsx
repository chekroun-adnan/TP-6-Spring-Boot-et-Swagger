"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createStudent } from "@/lib/api"
import { AlertCircle, CheckCircle } from "lucide-react"

interface StudentFormProps {
  onSuccess: () => void
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createStudent(formData)
      setSuccess(true)
      setFormData({ firstName: "", lastName: "", email: "" })

      setTimeout(() => {
        setSuccess(false)
        onSuccess()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create student")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-primary/20">
      <h2 className="text-xl font-semibold text-foreground mb-6">Add New Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">First Name</label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Last Name</label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-600">Student created successfully!</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Student"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
