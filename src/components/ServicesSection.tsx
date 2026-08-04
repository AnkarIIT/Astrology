import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Compass, Heart, Briefcase, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, type Service } from "@/lib/data";

const iconMap: Record<string, typeof Compass> = {
  Compass,
  Heart,
  Briefcase,
  Sun,
  Moon,
  Shield,
};

export default function ServicesSection({ limit }: { limit?: number }) {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.services().then(setServices);
  }, []);

  const list = limit ? services.slice(0, limit) : services;

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
            {t("services.title")}
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("services.subtitle")}</p>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-slate-500">{t("misc.loading")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((service, index) => {
              const Icon = iconMap[service.icon] || Compass;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/services/${service.id}`}>
                    <Card className="glass border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 group h-full">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className={`w-6 h-6 ${index % 2 ? "text-pink-400" : "text-gold-400"}`} />
                        </div>
                        <CardTitle className="text-2xl font-serif text-gold-300">
                          {isHindi ? service.title_hi : service.title_en}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <CardDescription className="text-slate-400 text-base">
                          {isHindi ? service.description_hi : service.description_en}
                        </CardDescription>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gold-400 font-semibold">
                            {service.price > 0
                              ? `${t("services.from")} ₹${service.price}`
                              : ""}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
