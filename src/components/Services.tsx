import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Compass, Heart, Briefcase, Shield } from "lucide-react";

const services = [
  {
    title: "Birth Chart Analysis",
    description: "A deep dive into your unique cosmic blueprint at the moment of your birth.",
    icon: Compass,
    color: "text-blue-400",
  },
  {
    title: "Relationship Compatibility",
    description: "Understand the celestial dynamics between you and your partner.",
    icon: Heart,
    color: "text-pink-400",
  },
  {
    title: "Career Guidance",
    description: "Align your professional path with your natural talents and cosmic timing.",
    icon: Briefcase,
    color: "text-gold-400",
  },
  {
    title: "Yearly Forecast",
    description: "Prepare for the opportunities and challenges the coming year holds for you.",
    icon: Sun,
    color: "text-orange-400",
  },
  {
    title: "Spiritual Healing",
    description: "Remedies and rituals to balance your planetary energies and find inner peace.",
    icon: Moon,
    color: "text-purple-400",
  },
  {
    title: "Vastu Consultation",
    description: "Harmonize your living and working spaces with universal energies.",
    icon: Shield,
    color: "text-green-400",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 bg-celestial-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Celestial Services
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore our range of astrological services designed to bring clarity, harmony, and success to every aspect of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 group h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-serif text-gold-300">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
