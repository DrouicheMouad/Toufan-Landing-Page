import React from "react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-serif">404</h1>
        <p className="text-muted-foreground font-serif">الصفحة غير موجودة.</p>
        <a href="/" className="text-primary hover:underline underline-offset-4 inline-block mt-4">
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  )
}
