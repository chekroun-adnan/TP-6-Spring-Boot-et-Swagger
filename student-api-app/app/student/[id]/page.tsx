import { StudentProfile } from "@/components/student-profile"
import { Header } from "@/components/header"

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const studentId = Number.parseInt(params.id, 10)

  if (isNaN(studentId)) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-destructive">Invalid student ID</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <StudentProfile studentId={studentId} />
      </div>
    </main>
  )
}
