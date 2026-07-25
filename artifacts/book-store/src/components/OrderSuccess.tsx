import React from "react"
import { BOOK_PRICE } from "@workspace/api-zod"

interface OrderSuccessProps {
  trackingNumber: string;
  deliveryPrice?: number;
}

export function OrderSuccess({ trackingNumber, deliveryPrice }: OrderSuccessProps) {
  const totalPrice = deliveryPrice !== undefined ? BOOK_PRICE + deliveryPrice : null

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

      <p className="text-sm text-muted-foreground font-serif italic">
        "الكلمات الأخيرة لا تضيع، بل تجد من يحملها."
      </p>
    </div>
  )
}
