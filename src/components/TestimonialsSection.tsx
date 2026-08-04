import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { api, type Testimonial } from "@/lib/data";

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.testimonials().then(setTestimonials);
  }, []);

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            {t("testimonials.title")}
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-center text-slate-500">{t("misc.loading")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-gold-500/10 h-full relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-gold-500/20">
                    <Quote className="w-12 h-12" />
                  </div>
                  <CardContent className="pt-12">
                    <div className="flex gap-1 mb-4 text-gold-400">
                      {Array.from({ length: Math.min(testimonial.rating, 5) }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 italic mb-8 relative z-10">
                      "{isHindi ? testimonial.content_hi : testimonial.content_en}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 bg-gold-500/10 flex items-center justify-center font-serif font-bold text-gold-300">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif text-gold-300 font-bold">{testimonial.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
