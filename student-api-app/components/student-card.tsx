"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, User, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
}

export function StudentCard({ student }: { student: Student }) {
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()

  return (
    <Link href={`/student/${student.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {student.firstName} {student.lastName}
              </h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>ID: {student.id}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
