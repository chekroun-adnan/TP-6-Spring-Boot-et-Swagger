export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SA</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Student API</h1>
        </div>
      </div>
    </header>
  )
}
