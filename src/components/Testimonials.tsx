import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Entrepreneur",
    content: "Dhiraj's reading was incredibly accurate. He helped me understand why I was facing certain blocks in my business and gave me the confidence to pivot at the right time.",
    image: "https://picsum.photos/seed/sarah/100/100",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "I was skeptical at first, but the yearly forecast was spot on. The timing of major life events he predicted was uncanny. A truly enlightening experience.",
    image: "https://picsum.photos/seed/michael/100/100",
  },
  {
    name: "Elena Rodriguez",
    role: "Artist",
    content: "The spiritual healing session was transformative. I feel more aligned and at peace than I have in years. His wisdom is deep and his approach is very compassionate.",
    image: "https://picsum.photos/seed/elena/100/100",
  },
];

export default function Testimonials() {
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
            Voices of the Stars
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Read what our clients have to say about their journey with Celestial Insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
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
                  <p className="text-slate-300 italic mb-8 relative z-10">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full border-2 border-gold-500/30"
                      referrerPolicy="no-referrer"
                    />
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
      </div>
    </section>
  );
}
