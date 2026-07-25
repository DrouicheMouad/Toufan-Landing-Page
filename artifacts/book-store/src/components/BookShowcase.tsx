import React from "react"

export function BookShowcase() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Book Cover Image */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-4 bg-black/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <img 
          src={`${import.meta.env.BASE_URL}book_cover.jpg`} 
          alt="تحت راية الطوفان" 
          className="relative w-64 md:w-80 rounded-sm shadow-2xl shadow-black/20 object-cover aspect-[2/3] border border-black/10"
        />
      </div>

      {/* Book Info */}
      <div className="text-center md:text-right max-w-lg shrink">
        <div className="inline-block border border-primary/30 text-primary px-3 py-1 text-xs tracking-widest mb-6 font-serif">
          الإصدار الأخير
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
          تحت راية<br/>الطوفان
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed mb-8">
          عندما تصبح الكلمة الملاذ الأخير، والورقة ساحة للصمود. هذا الكتاب ليس مجرد نصوص، بل هو وداع شخصي وشهادة أخيرة.
        </p>

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center md:justify-start gap-4 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-foreground tracking-tight">1200</span>
            <span className="text-xl text-muted-foreground font-serif">د.ج</span>
          </div>
        </div>

        <div className="w-12 h-px bg-border mx-auto md:mx-0"></div>
      </div>
      
    </div>
  )
}
