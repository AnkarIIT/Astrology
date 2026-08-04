import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Award, Users, Globe } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { icon: Award, value: "10+", label: t("about.creds.0") },
    { icon: Star, value: "5000+", label: t("about.creds.3") },
    { icon: Users, value: "6", label: t("services.title") },
    { icon: Globe, value: "100%", label: t("brand.tagline") },
  ];

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t("about.title")}
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {t("about.intro")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <div className="text-3xl font-serif font-bold text-gold-300">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl font-serif font-bold text-gold-300 mb-6">
            {t("about.storyTitle")}
          </h2>
          <p className="text-slate-400 leading-relaxed text-lg">{t("about.story")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl font-serif font-bold text-gold-300 mb-6">
            {t("about.credTitle")}
          </h2>
          <ul className="space-y-4">
            {(t("about.creds", { returnObjects: true }) as string[]).map((cred, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <Star className="w-4 h-4 text-gold-400 shrink-0" />
                {cred}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="text-center">
          <Link to="/book">
            <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-10 py-6 text-lg rounded-full">
              {t("about.cta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
