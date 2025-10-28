"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { getStudentProfile } from "@/lib/api"
import { Mail, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface StudentProfileProps {
  studentId: number
}

interface StudentProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  _links?: {
    self?: { href: string }
  }
}

export function StudentProfile({ studentId }: StudentProfileProps) {
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getStudentProfile(studentId)
        setStudent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [studentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 border-destructive bg-destructive/5">
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">Make sure the API is running on localhost:8081</p>
      </Card>
    )
  }

  if (!student) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Student not found</p>
      </Card>
    )
  }

  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()

  return (
    <div className="space-y-6">
      <Link href="/">
        <Button variant="outline" className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Button>
      </Link>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">Student ID: {student.id}</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-lg text-foreground">{student.firstName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-lg text-foreground">{student.lastName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-lg text-foreground break-all">{student.email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Information
              </label>
              <div className="bg-secondary/50 p-4 rounded-md">
                <p className="text-sm text-foreground">
                  <span className="font-medium">ID:</span> {student.id}
                </p>
                {student._links?.self?.href && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">API Link:</span> {student._links.self.href}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
