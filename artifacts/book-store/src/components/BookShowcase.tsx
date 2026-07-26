import React from "react"
import { BOOK_PRICE, getDeliveryPrice } from "@workspace/api-zod"
import { Button } from "@/components/ui/button"
import { useGetWilayas } from "@workspace/api-client-react"

export function BookShowcase() {
  const { data: wilayas = [] } = useGetWilayas()

  // Default to Sidi Bel Abbès (id 22) if available; otherwise first deliverable wilaya
  const defaultWilaya = wilayas.find(w => w.name === "Sidi Bel Abbès") ?? wilayas[0]
  const homeDeliveryPrice = defaultWilaya ? getDeliveryPrice(defaultWilaya.name, false) : 0
  const totalPrice = BOOK_PRICE + homeDeliveryPrice

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Book Cover Image */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-4 bg-black/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative overflow-hidden rounded-sm shadow-2xl shadow-black/20 border border-black/10 transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1">
          <img 
            src={`${import.meta.env.BASE_URL}book_cover.jpg`} 
            alt="تحت راية الطوفان" 
            className="w-64 md:w-80 h-auto object-contain"
          />
        </div>
      </div>

      {/* Book Info */}
      <div className="text-center md:text-right max-w-lg shrink">
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
          تحت راية<br/>الطوفان
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed mb-8">
          عندما تصبح الكلمة الملاذ الأخير، والورقة ساحة للصمود. هذا الكتاب ليس مجرد نصوص، بل هو وداع شخصي وشهادة أخيرة.
        </p>

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center md:justify-start gap-4 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-foreground tracking-tight">{BOOK_PRICE.toLocaleString("ar-DZ")}</span>
            <span className="text-xl text-muted-foreground font-serif">د.ج</span>
          </div>
        </div>

        <Button
          onClick={scrollToOrder}
          className="h-14 px-8 text-lg font-bold font-serif tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 mb-8"
        >
          النسخ محدودة جدا، اطلب الآن
        </Button>

        <div className="w-12 h-px bg-border mx-auto md:mx-0"></div>
      </div>
      
    </div>
  )
}
