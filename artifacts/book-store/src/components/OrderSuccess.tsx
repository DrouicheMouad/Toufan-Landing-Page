import React from "react"
import { BOOK_PRICE } from "@workspace/api-zod"
import { Button } from "@/components/ui/button"

interface OrderSuccessProps {
  trackingNumber: string;
  deliveryPrice?: number;
}

export function OrderSuccess({ trackingNumber, deliveryPrice }: OrderSuccessProps) {
  const totalPrice = deliveryPrice !== undefined ? BOOK_PRICE + deliveryPrice : null
  const whatsappNumber = "+213563289607"
  const whatsappMessage = encodeURIComponent(`مرحباً، أريد متابعة طلبي. رقم التتبع: ${trackingNumber}`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="w-full max-w-xl mx-auto bg-card rounded-md shadow-sm border border-card-border p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h2 className="text-3xl font-serif text-foreground mb-4">تم تأكيد طلبك بنجاح</h2>
      
      <p className="text-muted-foreground mb-8 leading-relaxed">
        شكراً لك. سيتم شحن نسختك قريباً. 
        <br/>
        هذا هو رقم التتبع الخاص بك، يرجى الاحتفاظ به:
      </p>

      <div className="bg-background border border-border rounded-md p-6 mb-8">
        <span className="block text-sm text-muted-foreground mb-2">رقم التتبع</span>
        <span className="block text-3xl font-mono tracking-wider font-bold text-foreground" dir="ltr">
          {trackingNumber}
        </span>
      </div>

      {totalPrice !== null && (
        <div className="mb-8 p-4 rounded-md border border-border bg-muted/30">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">سعر الكتاب</span>
            <span>{BOOK_PRICE.toLocaleString("ar-DZ")} د.ج</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">سعر التوصيل</span>
            <span>{deliveryPrice?.toLocaleString("ar-DZ")} د.ج</span>
          </div>
          <div className="h-px bg-border mb-2" />
          <div className="flex justify-between font-bold text-foreground">
            <span>المجموع</span>
            <span>{totalPrice.toLocaleString("ar-DZ")} د.ج</span>
          </div>
        </div>
      )}

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block mb-6">
        <Button className="w-full h-14 text-lg font-bold font-serif tracking-wide bg-[#25D366] text-white hover:bg-[#1ea855] transition-colors gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.955L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          تواصلوا معنا على الواتساب
        </Button>
      </a>

      <p className="text-sm text-muted-foreground font-serif italic">
        "الكلمات الأخيرة لا تضيع، بل تجد من يحملها."
      </p>
    </div>
  )
}
