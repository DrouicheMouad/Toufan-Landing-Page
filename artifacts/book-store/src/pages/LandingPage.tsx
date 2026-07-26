import React, { useState } from "react"
import { BookShowcase } from "@/components/BookShowcase"
import { AuthorSection } from "@/components/AuthorSection"
import { OrderForm } from "@/components/OrderForm"
import { OrderSuccess } from "@/components/OrderSuccess"

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null)
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      
      {/* Texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

      <main className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <BookShowcase />

        <AuthorSection />

        <div className="mt-20 md:mt-32 relative" id="order-section">
          {/* subtle separator */}
          <div className="absolute left-1/2 -top-10 md:-top-16 w-px h-12 md:h-20 bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2"></div>
          
          {trackingNumber ? (
            <OrderSuccess trackingNumber={trackingNumber} deliveryPrice={deliveryPrice ?? undefined} />
          ) : (
            <div className="animate-in fade-in duration-700 delay-300 fill-mode-both">
              <OrderForm onSuccess={(tracking, price) => {
                setTrackingNumber(tracking)
                setDeliveryPrice(price)
              }} />
            </div>
          )}
        </div>
      </main>

      <footer className="mt-32 pb-8 text-center text-muted-foreground text-sm font-serif border-t border-border pt-8 relative z-10">
        <p>تحت راية الطوفان © {new Date().getFullYear()}. جميع الحقوق محفوظة.</p>
        <p className="mt-2 opacity-50">الفصل الأخير.</p>
      </footer>
    </div>
  )
}
