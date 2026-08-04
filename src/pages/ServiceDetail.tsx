import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { api, type Service } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function ServiceDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [notFound, setNotFound] = useState(false);
  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.services().then((list) => {
      const found = list.find((s) => s.id === id);
      if (found) setService(found);
      else setNotFound(true);
    });
  }, [id]);

  if (notFound) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <h1 className="text-4xl font-serif font-bold text-gold-300 mb-6">
          {t("blog.noPost")}
        </h1>
        <Link to="/services">
          <Button variant="outline" className="border-gold-500/30 text-gold-300">
            <ArrowLeft className="w-4 h-4" /> {t("nav.services")}
          </Button>
        </Link>
      </section>
    );
  }

  if (!service) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <p className="text-slate-400">{t("misc.loading")}</p>
      </section>
    );
  }

  const includes = [
    t("booking.concern"),
    t("kundli.results.lagna"),
    t("kundli.results.nakshatra"),
  ];

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {t("nav.services")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-300">
              {isHindi ? service.title_hi : service.title_en}
            </h1>
            {service.price > 0 && (
              <div className="text-right">
                <div className="text-3xl font-serif font-bold text-gold-400">
                  ₹{service.price}
                </div>
                <div className="text-xs text-slate-500">
                  {t("services.perSession")}
                </div>
              </div>
            )}
          </div>

          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            {isHindi ? service.description_hi : service.description_en}
          </p>

          <div className="flex items-center gap-2 text-slate-400 mb-8">
            <Clock className="w-5 h-5 text-gold-500" />
            {t("services.duration")}: {service.duration_minutes} {t("services.minutes")}
          </div>

          <h2 className="text-2xl font-serif font-bold text-gold-300 mb-4">
            {t("services.title")}
          </h2>
          <ul className="space-y-3 mb-10">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <Link to={`/book?service=${service.id}`}>
            <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-8 py-6 text-lg rounded-full">
              {t("services.book")}
            </Button>
          </Link>

          {!isSupabaseConfigured() && (
            <p className="mt-6 text-sm text-amber-500/80">
              ⚠ Bookings need Supabase configured in .env.local
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
