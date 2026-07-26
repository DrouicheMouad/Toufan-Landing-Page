import React from "react"
import { Button } from "@/components/ui/button"

interface OrderCTAProps {
  headline?: string
  subline?: string
  buttonLabel?: string
  variant?: "dark" | "light"
}

export function OrderCTA({
  headline = "نسخك محدودة — لا تفوّت فرصة امتلاكها",
  subline = "اضغط الزر أدناه واملأ بياناتك في أقل من دقيقة.",
  buttonLabel = "اطلب نسختك الآن",
  variant = "light",
}: OrderCTAProps) {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })
  }

  const isDark = variant === "dark"

  return (
    <div
      className={`rounded-md border px-6 py-10 md:py-14 text-center relative overflow-hidden ${
        isDark
          ? "bg-foreground border-foreground text-background"
          : "bg-card border-card-border text-foreground"
      }`}
    >
      {/* Accent bar */}
      <div className={`absolute top-0 inset-x-0 h-1 ${isDark ? "bg-primary" : "bg-primary"}`} />

      <h2
        className={`text-2xl md:text-3xl font-serif font-bold mb-3 leading-snug ${
          isDark ? "text-background" : "text-foreground"
        }`}
      >
        {headline}
      </h2>
      <p
        className={`text-base md:text-lg font-serif mb-8 max-w-lg mx-auto leading-relaxed ${
          isDark ? "text-background/70" : "text-muted-foreground"
        }`}
      >
        {subline}
      </p>
      <Button
        onClick={scrollToOrder}
        className={`h-14 px-10 text-lg font-bold font-serif tracking-wide shadow-lg transition-all duration-300 hover:scale-105 ${
          isDark
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
        }`}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
