import React from "react"
import { Button } from "@/components/ui/button"

export function OrderCTA() {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="rounded-md border px-6 py-10 md:py-14 text-center relative overflow-hidden bg-card border-card-border text-foreground">
      {/* Accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-primary" />

      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 leading-snug text-foreground">
        هل تريد أن تعرف أكثر عن حياة الأبطال ؟
      </h2>
      <p className="text-base md:text-lg font-serif mb-8 max-w-lg mx-auto leading-relaxed text-muted-foreground">
        لا تنتظر كثيراً — اطلب نسختك الآن قبل أن تنتهي الكمية المتاحة.
      </p>
      <Button
        onClick={scrollToOrder}
        className="h-14 px-10 text-lg font-bold font-serif tracking-wide shadow-lg transition-all duration-300 hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
      >
        اطلب نسختك الآن
      </Button>
    </div>
  )
}
