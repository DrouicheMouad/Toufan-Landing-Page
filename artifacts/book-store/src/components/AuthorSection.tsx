import React from "react"
import { motion } from "framer-motion"

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const pressOutlets = [
  { name: "الشروق", line: "كتاب يلتقط أصواتاً من هامش التاريخ الجزائري." },
  { name: "الخبر", line: "نصوص تتجاوز السرد إلى شهادة حية." },
  { name: "الوطن", line: "صوت يستحق أن يُقرأ بتمهل وبصوت عالٍ." }
]

export function AuthorSection() {
  return (
    <section className="max-w-5xl mx-auto mb-24 md:mb-32" id="author-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="space-y-16"
      >
        {/* Author intro */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative shrink-0 group">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-transparent blur-xl rounded-full opacity-60 group-hover:opacity-100 transition duration-700" />
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-border shadow-lg grayscale group-hover:grayscale-0 transition-all duration-700">
              <img
                src={`${import.meta.env.BASE_URL}book_cover.jpg`}
                alt="صورة الكاتب"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xs tracking-widest text-primary/80 uppercase font-serif mb-3 block">نبذة عن الكاتب</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">اسم الكاتب</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-serif max-w-xl">
              كاتب وشاعر جزائري، عاش بين أصوات المدينة وهدوء الريف. كتابته انفعال بالذاكرة والمكان،
              ومحاولة لإنقاذ ما تبقى من حكايات قبل أن تذوب.
            </p>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div variants={fadeInUp} className="bg-card border border-card-border rounded-md p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-1 bg-primary" />
          <h3 className="text-2xl font-serif font-bold text-foreground mb-4">قصته</h3>
          <div className="prose prose-lg max-w-none text-muted-foreground font-serif leading-relaxed">
            <p>
              بدأ الكتابة في سنوات مبكرة، ملاحظاً تفاصيل لا يلتفت إليها أحد. مرّ بمحطات صعبة تركت فيه
              أثراً عميقاً، فكان الكتاب ملجأً وصوتاً.
            </p>
            <p>
              "تحت راية الطوفان" ليس سرداً تقليدياً، بل هو محاولة لتجميع شظايا تجربة شخصية ووطنية معاً،
              في نصوص تتنفس حزناً وصموداً في آن.
            </p>
            <p>
              يقول إنه لم يعد يكتب للنشر فقط، بل ليترك شهادة. هذا الكتاب هو تلك الشهادة، وربما الأخيرة.
            </p>
          </div>
        </motion.div>

        {/* Press */}
        <motion.div variants={fadeInUp}>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center md:text-right">كما تحدثت عنه الصحافة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pressOutlets.map((outlet) => (
              <div
                key={outlet.name}
                className="group relative overflow-hidden rounded-md border border-card-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative z-10">
                  <span className="block text-xl font-bold font-serif text-foreground mb-2 group-hover:text-white transition-colors">{outlet.name}</span>
                  <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors leading-relaxed">
                    {outlet.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photos & Video */}
        <motion.div variants={fadeInUp}>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center md:text-right">صور وفيديوهات</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-md border border-card-border bg-muted"
              >
                <img
                  src={`${import.meta.env.BASE_URL}book_cover.jpg`}
                  alt={`صورة ${i}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              </div>
            ))}
            <div className="relative aspect-video sm:aspect-square overflow-hidden rounded-md border border-card-border bg-muted group sm:col-span-2 lg:col-span-2">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                poster={`${import.meta.env.BASE_URL}book_cover.jpg`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-xs text-white/90 font-medium">لقطات من الكتاب</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
