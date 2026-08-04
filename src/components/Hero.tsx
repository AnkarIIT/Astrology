import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium tracking-widest uppercase mb-6">
            <Sparkles className="w-3 h-3" />
            {t("hero.badge")}
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight">
            {t("hero.title1")} <br />
            <span className="italic gold-gradient">{t("hero.title2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/book">
              <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                {t("hero.book")}
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10 px-8 py-6 text-lg rounded-full transition-all">
                {t("hero.explore")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 border border-gold-500/10 rounded-full z-0 opacity-50"
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 border border-gold-500/10 rounded-full z-0 opacity-50"
      />
    </section>
  );
}
