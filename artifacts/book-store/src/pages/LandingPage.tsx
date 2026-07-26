import React, { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { BookShowcase } from "@/components/BookShowcase"
import { AuthorSection } from "@/components/AuthorSection"
import { OrderCTA } from "@/components/OrderCTA"
import { FooterCTA } from "@/components/FooterCTA"
import { OrderForm } from "@/components/OrderForm"
import { OrderSuccess } from "@/components/OrderSuccess"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "213XXXXXXXXX"
const WHATSAPP_MESSAGE = "مرحباً، أودّ الاستفسار عن كتاب «تحت راية الطوفان»"

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null)
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground" dir="rtl">

      {/* Texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* 1) Sticky navbar */}
      <Navbar />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      <main className="container mx-auto px-4 pt-28 md:pt-32 pb-16 relative z-10">

        {/* Hero */}
        <BookShowcase />

        {/* 2) Author section */}
        <AuthorSection />

        {/* CTA #2 — after author section, before order form */}
        <div className="my-16 md:my-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <OrderCTA />
        </div>

        {/* 3) Order form */}
        <div className="relative" id="order-section">
          {/* subtle separator */}
          <div className="absolute left-1/2 -top-10 md:-top-16 w-px h-12 md:h-20 bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

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

        {/* CTA #3 — very bottom, dark variant for contrast */}
        <div className="mt-20 md:mt-28 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <FooterCTA />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border relative z-10" dir="rtl">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-serif">
          <span>تحت راية الطوفان © {new Date().getFullYear()}. جميع الحقوق محفوظة.</span>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-h-[44px] px-3 rounded-md hover:bg-muted/60 transition-colors text-foreground/70 hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 shrink-0"
              style={{ fill: "#25D366" }}
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            تواصل عبر واتساب
          </a>
        </div>
      </footer>
    </div>
  )
}
