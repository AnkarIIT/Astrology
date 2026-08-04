import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RASHI_NAMES } from "@/lib/astrology";
import { api, type Horoscope } from "@/lib/data";

export default function Horoscope() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [active, setActive] = useState(0);
  const [data, setData] = useState<Record<number, Horoscope | undefined>>({});
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    api.horoscopes().then((list) => {
      const map: Record<number, Horoscope | undefined> = {};
      for (const h of list) {
        if (h.period !== period) continue;
        const idx = RASHI_NAMES.en.findIndex((r) => r.startsWith(h.rashi)) >= 0
          ? RASHI_NAMES.en.findIndex((r) => r.startsWith(h.rashi))
          : parseInt(h.rashi) || 0;
        map[idx] = h;
      }
      setData(map);
    });
  }, [period]);

  const current = data[active];
  const text = current ? (isHindi ? current.text_hi : current.text_en) : null;

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-serif font-bold mb-4">{t("horoscope.title")}</h1>
          <p className="text-slate-400">{t("horoscope.subtitle")}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                period === p
                  ? "bg-gold-500 text-celestial-950"
                  : "glass text-slate-400 hover:text-gold-300"
              }`}
            >
              {t(`horoscope.${p}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
          {RASHI_NAMES[isHindi ? "hi" : "en"].map((rashi, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`p-3 rounded-xl text-sm transition-all ${
                active === i
                  ? "bg-gold-500 text-celestial-950 font-bold"
                  : "glass text-slate-300 hover:border-gold-500/40"
              }`}
            >
              {rashi}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-10 text-center"
        >
          <h2 className="text-3xl font-serif font-bold text-gold-300 mb-6">
            {RASHI_NAMES[isHindi ? "hi" : "en"][active]}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            {text ?? (
              <span className="text-slate-500 italic">
                {t("horoscope.generated")} — {new Date().toLocaleDateString()}
              </span>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
