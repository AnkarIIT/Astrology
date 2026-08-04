import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Sparkles } from "lucide-react";
import { RASHI_NAMES } from "@/lib/astrology";
import { api, type Horoscope } from "@/lib/data";
import { generateHoroscope } from "@/lib/horoscope";

export default function Horoscope() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [active, setActive] = useState(0);
  const [period, setPeriod] = useState("daily");
  const [dbData, setDbData] = useState<Horoscope[]>([]);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    api.horoscopes().then(setDbData).catch(() => {});
  }, []);

  const resolve = useCallback(
    async (rashiIdx: number, per: string) => {
      const rashiEn = RASHI_NAMES.en[rashiIdx];
      const rashiHi = RASHI_NAMES.hi[rashiIdx];

      const db = dbData.find(
        (h) =>
          h.period === per &&
          (RASHI_NAMES.en.some((r) => r.startsWith(h.rashi))
            ? RASHI_NAMES.en.findIndex((r) => r.startsWith(h.rashi)) === rashiIdx
            : parseInt(h.rashi) === rashiIdx)
      );
      if (db) {
        setText(isHindi ? db.text_hi : db.text_en);
        return;
      }

      setText(null);
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      const gen = await generateHoroscope(rashiEn, rashiHi, per, isHindi ? "hi" : "en");
      loadingRef.current = false;
      setLoading(false);
      if (gen) setText(gen);
    },
    [dbData, isHindi]
  );

  useEffect(() => {
    resolve(active, period);
  }, [active, period, resolve]);

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
          key={active + period}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-10 text-center"
        >
          <h2 className="text-3xl font-serif font-bold text-gold-300 mb-6">
            {RASHI_NAMES[isHindi ? "hi" : "en"][active]}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
              {t("horoscope.generating")}
            </div>
          ) : text ? (
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">{text}</p>
          ) : (
            <p className="text-slate-500 italic flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t("horoscope.generated")} — {new Date().toLocaleDateString()}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
