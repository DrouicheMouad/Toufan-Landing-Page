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

const mediaItems = [
  {
    type: "video" as const,
    src: `${import.meta.env.BASE_URL}media/video1.mp4`,
    title: "من وصايا الشهيد -رحمه الله وتقبله",
    caption: "اقرؤوا القرآن في بيوتكم، فالبيت الذي يُقرأ فيه القرآن ليس كغيره",
  },
  {
    type: "video" as const,
    src: `${import.meta.env.BASE_URL}media/video2.mp4`,
    title: "تلاوة عطرة من سورة فصلت",
    caption: "تلاوة من آيات الذكر الحكيم",
  },
  {
    type: "video" as const,
    src: `${import.meta.env.BASE_URL}media/video3.mp4`,
    title: "الشهيد محمد زكي حمد -رحمه الله وتقبله- ينشد مع أولاده",
    caption: "لحظات من الفرح والإنشاد مع أطفاله",
  },
]

const pressOutlets = [
  {
    name: "الجزيرة نت",
    line: "بين المحراب والأنفاق.. قصة محمد زكي حمد التي خلدتها المنصات",
    url: "https://www.aljazeera.net/news/2026/5/3/%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85%D8%AD%D8%B1%D8%A7%D8%A8-%D9%88%D8%A7%D9%84%D8%A3%D9%86%D9%81%D8%A7%D9%82-%D9%82%D8%B5%D8%A9-%D9%85%D8%AD%D9%85%D8%AF-%D8%B2%D9%83%D9%8A-%D8%AD%D9%85%D8%AF",
    image: "https://www.aljazeera.net/wp-content/uploads/2026/05/54545454-1777821736.jpg?resize=1920%2C1280&quality=80",
  },
  {
    name: "جريدة القدس",
    line: "بين المحراب والأنفاق.. سيرة الشهيد محمد زكي حمد قائد فصيل 'بيت حانون' ومؤلف 'تحت راية الطوفان'",
    url: "https://alquds.com/ar/posts/238114",
    image: "https://cdn.alquds.com/uploads/8181f3bc6614b7bdc7fdca167888a42f.jpg",
  },
  {
    name: "TRT عربي",
    line: "\"تحت راية الطوفان\".. ملامح من عالَم رجل الأنفاق محمد حمد زكي",
    url: "https://www.trtarabi.com/article/be5856deb43e",
    image: "https://d2udx5iz3h7s4h.cloudfront.net/2025/12/5/67336bb1cfcbfe8e438f5e44/image/bf5732c6be534e0e36fd410861c94d68412b8b9deceedf91e0a56d4ab9904974.jpg?width=1080&format=jpg&quality=80",
  },
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
            <span className="text-xs tracking-widest text-primary/80 uppercase font-serif mb-3 block">تعرف على الكاتب</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">اسم الكاتب</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-serif max-w-xl">الشيخ الباحث والكاتب محمد زكي حمد (1994 – 2025)، أحد أبرز طلبة العلم الشريف والقراء في قطاع غزة، وقائد ميداني في كتيبة بيت حانون. جمع في مسيرة حياته الحافلة بين التحصيل الأكاديمي والشرعي الراسخ، والعمل المؤسسي والقرآني، والتأليف والتوثيق الميداني من قلب ظروف الحرب والحصار</p>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div variants={fadeInUp} className="bg-card border border-card-border rounded-md p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-1 bg-primary" />
          <h3 className="text-2xl font-serif font-bold text-foreground mb-4">نبذة عن حياته</h3>

          <div className="space-y-8 text-muted-foreground font-serif leading-relaxed">
            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">المسار الأكاديمي والشرعي</h4>
              <div className="space-y-3">
                <p>
                  <strong>النشأة والتعليم:</strong> وُلد في بلدة بيت حانون شمال قطاع غزة في يوليو 1994 لأسرة وعائلة عريقة اهتمت بالتعليم والعلم الشرعي. أتمّ حفظ القرآن الكريم كاملاً في سن العاشرة.
                </p>
                <p>
                  <strong>التخصص الشرعي:</strong> حصل على درجتي البكالوريوس والماجستير في أصول الدين من الجامعة الإسلامية بغزة، وكانت رسالته للماجستير بعنوان "القيم الإعلامية في الخطاب القرآني". تتلمذ على يد نخبة من علماء قطاع غزة وقرّائها، ونال إجازات قرآنية مسندة جعلته من أعلى القراء سنداً في القطاع.
                </p>
                <p>
                  <strong>المشاريع القرآنية:</strong> عمل في إدارة دار القرآن الكريم والسنة، وكان صاحب الفكرة والمؤسس والمشرف المباشر على مشروع "صفوة الحفاظ"، وهو المشروع الذي أثمر عن سرد أكثر من 1400 حافظ وحافظة للقرآن الكريم في جلسة واحدة دون أخطاء.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">المسار الميداني والفكري</h4>
              <p>
                التحق محمد بالعمل الميداني والتنظيمي منذ سن مبكرة، وتدرج في المسؤوليات حتى أصبح أميراً لمسجد العجمي ببيت حانون، ثم قائداً لفصيل في قوات النخبة بكتيبة بيت حانون التابعة لكتائب القسام. شارك في التصدّي لعدة حروب واجتياحات ميدانية، بدءاً من عام 2014 وصولاً إلى الحرب الأخيرة عام 2023.
              </p>
              <p className="mt-3">
                وقد تميز بنهجه الشامل الذي يربط بين المحراب والميدان، حيث حرص على إقراء القرآن ومنح الإجازات وترتيب جلسات الإسناد لرفاقه داخل الأنفاق والعقد القتالية في أشد ساعات العسرة.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">مؤلفاته وإرثه الأدبي</h4>
              <p>
                <strong>كتاب «تحت راية الطوفان.. خندق خباب»:</strong> تأليف صاغه الكاتب بيده من داخل الأنفاق المحاصرة والعقد القتالية في بيت حانون وسط القصف والدمار. يُعد الكتاب شهادة ميدانية ونادرة تكشف كواليس العمل الميداني والجهد البشري والمخاطر الجسيمة التي لا تظهر عبر شاشات الإعلام. أتم كتابة مؤلَّفه قبل استشهاده بخمسة أيام فقط ليصدر عن "هيئة علماء فلسطين".
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">الاستشهاد</h4>
              <p>
                ارتقى الشهيد محمد زكي حمد في 12 يوليو/تموز 2025 إثر غارة استهدفت سيارة في مخيم الشاطئ بمدينة غزة، تاركاً خلفه إرثاً كبيراً في خدمة القرآن الكريم، ومؤلفاً وثّق تجربة جيله، ووصية مؤثرة لابنه زكي ولأبنائه في التمسك بالقرآن والاعتزاز بالدين.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Press */}
        <motion.div variants={fadeInUp}>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center md:text-right">تغطيات إعلامية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pressOutlets.map((outlet) => (
              <a
                key={outlet.name}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-md border border-card-border bg-card hover:border-primary/40 transition-colors block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={outlet.image}
                    alt={outlet.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </div>
                <div className="relative p-6">
                  <span className="block text-lg font-bold font-serif text-foreground mb-2">{outlet.name}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {outlet.line}
                  </p>
                  <span className="inline-flex items-center mt-4 text-sm font-medium text-primary group-hover:underline">
                    اقرأ المقال
                    <svg className="w-4 h-4 mr-2 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Videos */}
        <motion.div variants={fadeInUp}>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center md:text-right">صور وفيديوهات</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-md border border-card-border bg-muted"
              >
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  poster={`${import.meta.env.BASE_URL}book_cover.jpg`}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-white/80 leading-snug">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center md:text-right font-serif">
            اضغط على أي فيديو لتشغيله.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
