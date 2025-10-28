"use client"

import { useState } from "react"
import { StudentList } from "@/components/student-list"
import { StudentForm } from "@/components/student-form"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleStudentCreated = () => {
    setShowForm(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-2">Manage and view all student records</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <StudentForm onSuccess={handleStudentCreated} />
          </div>
        )}

        <StudentList key={refreshTrigger} />
      </div>
    </main>
  )
}
