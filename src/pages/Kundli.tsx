import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Clock, CalendarDays, User } from "lucide-react";
import {
  calculateKundli,
  RASHI_NAMES,
  NAKSHATRA_NAMES,
  CITIES,
  type KundliResult,
} from "@/lib/astrology";
import { api } from "@/lib/data";

const DEFAULT_TZ = 330;

export default function Kundli() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("12:00");
  const [city, setCity] = useState("Varanasi");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [tz, setTz] = useState(DEFAULT_TZ);
  const [result, setResult] = useState<KundliResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dob || !tob) {
      setError(t("kundli.errors.invalid"));
      return;
    }
    const cityData = CITIES[city];
    const lat = customLat ? parseFloat(customLat) : cityData?.[0] ?? 25.31;
    const lon = customLon ? parseFloat(customLon) : cityData?.[1] ?? 83.01;
    const tzOffset = cityData ? cityData[2] : tz;
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError(t("kundli.errors.invalid"));
      return;
    }
    try {
      const res = calculateKundli({ date: dob, time: tob, lat, lon, tzOffsetMin: tzOffset });
      setResult(res);
      setError("");
      api.createLead({ name: name || undefined, dob, tob, pob: city, result: res }).catch(() => {});
    } catch {
      setError(t("kundli.errors.failed"));
    }
  };

  const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-xl md:text-2xl font-serif font-bold text-gold-300">{value}</div>
    </div>
  );

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif font-bold mb-4">{t("kundli.title")}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("kundli.subtitle")}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3 text-gold-500" /> {t("kundli.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-3 h-3 text-gold-500" /> {t("kundli.dob")}
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3 text-gold-500" /> {t("kundli.tob")}
              </label>
              <input
                required
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gold-500" /> {t("kundli.pob")}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              >
                {Object.keys(CITIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest">Lat</label>
                <input
                  type="number"
                  step="any"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="e.g. 25.31"
                  className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest">Lon</label>
                <input
                  type="number"
                  step="any"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  placeholder="e.g. 83.01"
                  className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
          </div>

          {!CITIES[city] && (
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">
                GMT Offset (minutes)
              </label>
              <input
                type="number"
                value={tz}
                onChange={(e) => setTz(Number(e.target.value))}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg"
          >
            <Sparkles className="w-5 h-5" /> {t("kundli.calculate")}
          </Button>
        </motion.form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <h2 className="text-3xl font-serif font-bold text-gold-300">
                {t("kundli.results.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <ResultRow
                label={t("kundli.results.lagna")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][result.lagnaRashi]}
              />
              <ResultRow
                label={t("kundli.results.rashi")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][result.moonRashi]}
              />
              <ResultRow
                label={t("kundli.results.nakshatra")}
                value={NAKSHATRA_NAMES[isHindi ? "hi" : "en"][result.nakshatra]}
              />
              <ResultRow
                label={t("kundli.results.sun")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][result.sunRashi]}
              />
            </div>

            <div className="glass rounded-2xl p-6 text-center mb-8">
              <p className="text-slate-400 text-sm">{t("kundli.results.disclaimer")}</p>
            </div>

            <div className="text-center">
              <Link to="/book">
                <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-10 py-6 text-lg rounded-full">
                  {t("kundli.results.book")}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
