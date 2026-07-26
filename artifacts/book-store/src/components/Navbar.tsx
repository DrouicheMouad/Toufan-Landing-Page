import React, { useEffect, useState } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-sm"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Site name / logo */}
        <span className="font-serif text-base font-bold text-foreground tracking-wide select-none">
          تحت راية الطوفان
        </span>

        {/* Nav links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => scrollTo("author-section")}
            className="min-h-[44px] px-3 sm:px-4 text-sm font-serif text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
          >
            تعرف على الكتاب
          </button>
          <button
            onClick={() => scrollTo("order-section")}
            className="min-h-[44px] px-3 sm:px-4 text-sm font-serif text-foreground/80 border border-border rounded-md hover:bg-muted/60 hover:border-primary/40 transition-all"
          >
            اطلب الآن
          </button>
        </nav>
      </div>
    </header>
  )
}
