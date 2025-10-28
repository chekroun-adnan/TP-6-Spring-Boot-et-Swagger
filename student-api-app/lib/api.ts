const API_BASE_URL = "http://localhost:8081"

interface FetchStudentsParams {
  page?: number
  size?: number
  sort?: string
}

interface StudentData {
  firstName: string
  lastName: string
  email: string
}

interface Student extends StudentData {
  id: number
  _links?: {
    self?: { href: string }
  }
}

interface ApiError {
  message: string
  status: number
}

function handleApiError(response: Response, defaultMessage: string): ApiError {
  return {
    message: `${defaultMessage}: ${response.statusText}`,
    status: response.status,
  }
}

export async function fetchStudents(params: FetchStudentsParams = {}) {
  // Backend exposes GET /students/all returning full list
  const response = await fetch(`${API_BASE_URL}/students/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(handleApiError(response, "Failed to fetch students").message)
  }

  const rawStudents: Array<{ id: number; nom: string; prenom: string; dateNaissance?: string | Date }> = await response.json()

  // Map backend -> frontend shape
  const students: Student[] = rawStudents.map((s) => ({
    id: s.id,
    firstName: s.prenom,
    lastName: s.nom,
    email: "", // backend has no email; keep empty to satisfy UI/types
  }))

  // Client-side pagination + optional sort (asc) to match previous UI behavior
  const page = params.page ?? 0
  const size = params.size ?? students.length

  let sorted = students
  if (params.sort) {
    const [field, direction] = params.sort.split(",")
    const dir = (direction || "asc").toLowerCase() === "desc" ? -1 : 1
    sorted = [...students].sort((a: any, b: any) => {
      const av = (a?.[field] ?? "").toString().toLowerCase()
      const bv = (b?.[field] ?? "").toString().toLowerCase()
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }

  const start = page * size
  const end = start + size
  const pageItems = sorted.slice(start, end)

  return {
    _embedded: { students: pageItems },
    page: {
      size,
      totalElements: students.length,
      totalPages: Math.max(1, Math.ceil(students.length / size)),
      number: page,
    },
  }
}

export async function createStudent(data: StudentData) {
  const response = await fetch(`${API_BASE_URL}/students/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Map frontend -> backend shape; ignore email
    body: JSON.stringify({
      nom: data.lastName,
      prenom: data.firstName,
      // Optional: dateNaissance could be added here if you collect it in UI
    }),
  })

  if (!response.ok) {
    throw new Error(handleApiError(response, "Failed to create student").message)
  }

  return response.json()
}

export async function getStudentProfile(id: number) {
  // No dedicated endpoint in backend; fetch all and find one
  const list = await fetch(`${API_BASE_URL}/students/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  if (!list.ok) {
    throw new Error(handleApiError(list, "Failed to fetch student profile").message)
  }
  const rawStudents: Array<{ id: number; nom: string; prenom: string; dateNaissance?: string | Date }> = await list.json()
  const raw = rawStudents.find((s) => s.id === id)
  if (!raw) {
    throw new Error(`Student with id ${id} not found`)
  }
  const student: Student = {
    id: raw.id,
    firstName: raw.prenom,
    lastName: raw.nom,
    email: "",
  }
  return student
}

export async function updateStudent(id: number, data: Partial<StudentData>) {
  // Backend doesn't expose update; emulate via save with id if supported
  const response = await fetch(`${API_BASE_URL}/students/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Map frontend -> backend; include id
    body: JSON.stringify({
      id,
      nom: data.lastName,
      prenom: data.firstName,
      // dateNaissance if available
    }),
  })

  if (!response.ok) {
    throw new Error(handleApiError(response, "Failed to update student").message)
  }

  return response.json()
}

export async function deleteStudent(id: number) {
  const response = await fetch(`${API_BASE_URL}/students/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(handleApiError(response, "Failed to delete student").message)
  }

  return response.ok
}

export async function searchStudents(query: string, params: FetchStudentsParams = {}) {
  // No search endpoint; fetch all and filter client-side
  const all = await fetchStudents({ page: 0, size: Number.MAX_SAFE_INTEGER, sort: params.sort })
  const students = all._embedded?.students ?? []
  const q = (query || "").toLowerCase()
  const filtered = q
    ? students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q),
      )
    : students

  // Reuse pagination from params
  const page = params.page ?? 0
  const size = params.size ?? filtered.length
  const start = page * size
  const end = start + size
  const pageItems = filtered.slice(start, end)
  return {
    _embedded: { students: pageItems },
    page: {
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      number: page,
    },
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
