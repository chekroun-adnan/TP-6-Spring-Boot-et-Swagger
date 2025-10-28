"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentCard } from "./student-card"
import { SearchFilter } from "./search-filter"
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchStudents } from "@/lib/api"

interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  _links?: {
    self?: { href: string }
  }
}

interface StudentPage {
  _embedded?: {
    students: Student[]
  }
  page?: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("firstName")

  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadStudents()
  }, [currentPage, pageSize, sortBy])

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStudents({
        page: currentPage,
        size: pageSize,
        sort: `${sortBy},asc`,
      })

      if (data._embedded?.students) {
        let filteredStudents = data._embedded.students

        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase()
          filteredStudents = filteredStudents.filter(
            (student) =>
              student.firstName.toLowerCase().includes(lowerSearchTerm) ||
              student.lastName.toLowerCase().includes(lowerSearchTerm) ||
              student.email.toLowerCase().includes(lowerSearchTerm),
          )
        }

        setStudents(filteredStudents)
      }

      if (data.page) {
        setTotalPages(data.page.totalPages)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value)
      setCurrentPage(0)

      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
      }

      const timer = setTimeout(() => {
        loadStudents()
      }, 300)

      setSearchDebounceTimer(timer)
    },
    [searchDebounceTimer],
  )

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(0)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSortBy("firstName")
    setCurrentPage(0)
  }

  if (error) {
    return (
      <Card className="p-8 border-destructive bg-destructive/5">
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">Make sure the API is running on localhost:8081</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <SearchFilter
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearchChange={handleSearch}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{searchTerm ? "No students match your search" : "No students found"}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages} ({students.length} results)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
