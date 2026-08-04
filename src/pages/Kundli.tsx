import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Clock,
  CalendarDays,
  User,
  Loader2,
  Orbit,
  Timer,
  Sun,
} from "lucide-react";
import {
  calculateKundli,
  RASHI_NAMES,
  NAKSHATRA_NAMES,
  CITIES,
  type KundliResult,
} from "@/lib/astrology";
import { computeVedicKundli, type VedicKundli } from "@/lib/vedic";
import { api } from "@/lib/data";

const DEFAULT_TZ = 330;

function fmtTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VedicKundli | null>(null);
  const [fallback, setFallback] = useState<KundliResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
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
    setLoading(true);
    setError("");
    setResult(null);
    setFallback(null);
    const birth = { date: dob, time: tob, lat, lon, tzOffsetMin: tzOffset };
    try {
      const res = await computeVedicKundli(birth);
      setResult(res);
      api.createLead({ name: name || undefined, dob, tob, pob: city, result: res }).catch(() => {});
    } catch {
      try {
        const res = calculateKundli(birth);
        setFallback(res);
        api.createLead({ name: name || undefined, dob, tob, pob: city, result: res }).catch(() => {});
      } catch {
        setError(t("kundli.errors.failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-xl md:text-2xl font-serif font-bold text-gold-300">{value}</div>
    </div>
  );

  const detail = result;

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
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}{" "}
            {t("kundli.calculate")}
          </Button>
        </motion.form>

        {(result || fallback) && (
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
              {detail && (
                <p className="text-xs text-slate-500 mt-2">
                  {t("kundli.results.engine")} · {t("kundli.results.ayanamsa")}:{" "}
                  {detail.ayanamsa}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <ResultRow
                label={t("kundli.results.lagna")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][(detail ?? fallback!).lagnaRashi]}
              />
              <ResultRow
                label={t("kundli.results.rashi")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][(detail ?? fallback!).moonRashi]}
              />
              <ResultRow
                label={t("kundli.results.nakshatra")}
                value={
                  NAKSHATRA_NAMES[isHindi ? "hi" : "en"][(detail ?? fallback!).nakshatra] +
                  (detail ? ` · ${t("kundli.results.pada")} ${detail.nakshatraPada}` : "")
                }
              />
              <ResultRow
                label={t("kundli.results.sun")}
                value={RASHI_NAMES[isHindi ? "hi" : "en"][(detail ?? fallback!).sunRashi]}
              />
            </div>

            {detail && (
              <>
                {/* Graha positions */}
                <div className="glass rounded-3xl p-8 mb-8">
                  <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-gold-300 mb-6">
                    <Orbit className="w-5 h-5 text-gold-500" /> {t("kundli.results.grahaTitle")}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 uppercase tracking-widest border-b border-white/10">
                          <th className="py-2 pr-4">Graha</th>
                          <th className="py-2 pr-4">{t("kundli.results.rashi")}</th>
                          <th className="py-2 pr-4">{t("kundli.results.degree")}</th>
                          <th className="py-2">{t("kundli.results.state")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.grahas.map((g) => (
                          <tr key={g.name} className="border-b border-white/5">
                            <td className="py-2.5 pr-4 text-gold-200 font-semibold whitespace-nowrap">
                              {isHindi ? g.hi : g.name}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-300 whitespace-nowrap">
                              {g.signName}{" "}
                              <span className="text-slate-600">{RASHI_NAMES.hi[g.sign]}</span>
                            </td>
                            <td className="py-2.5 pr-4 text-slate-400">
                              {g.degree.toFixed(1)}°
                            </td>
                            <td className="py-2.5 text-slate-400">
                              {g.retrograde ? (
                                <span className="text-amber-400 text-xs">{t("kundli.results.retro")} (R)</span>
                              ) : (
                                <span className="text-emerald-400 text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vimshottari dasha */}
                <div className="glass rounded-3xl p-8 mb-8">
                  <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-gold-300 mb-6">
                    <Timer className="w-5 h-5 text-gold-500" /> {t("kundli.results.dashaTitle")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-2xl bg-gold-500/10 border border-gold-500/30 p-5 text-center">
                      <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                        {t("kundli.results.currentDasha")}
                      </div>
                      <div className="text-2xl font-serif font-bold text-gold-300">
                        {isHindi ? detail.dasha.current.hi : detail.dasha.current.planet}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {fmtDate(detail.dasha.current.start)} → {fmtDate(detail.dasha.current.end)}
                      </div>
                    </div>
                    {detail.dasha.currentSub && (
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                          {t("kundli.results.antardasha")}
                        </div>
                        <div className="text-2xl font-serif font-bold text-gold-300">
                          {isHindi ? detail.dasha.currentSub.hi : detail.dasha.currentSub.planet}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          {fmtDate(detail.dasha.currentSub.start)} →{" "}
                          {fmtDate(detail.dasha.currentSub.end)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                      {t("kundli.results.upcoming")}
                    </div>
                    <div className="space-y-2">
                      {detail.dasha.upcoming.map((p) => (
                        <div
                          key={p.planet + p.start}
                          className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
                        >
                          <span className="font-semibold text-slate-200">
                            {isHindi ? p.hi : p.planet}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {fmtDate(p.start)} → {fmtDate(p.end)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Today's panchang */}
                <div className="glass rounded-3xl p-8 mb-8">
                  <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-gold-300 mb-2">
                    <Sun className="w-5 h-5 text-gold-500" /> {t("kundli.results.panchangTitle")}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    {fmtDate(detail.panchangDate)} · {detail.birthData.lat.toFixed(2)},{" "}
                    {detail.birthData.lon.toFixed(2)}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      [t("kundli.results.tithi"), detail.panchang.tithi],
                      [t("kundli.results.nakshatraDay"), detail.panchang.nakshatra],
                      [t("kundli.results.yoga"), detail.panchang.yoga],
                      [t("kundli.results.karana"), detail.panchang.karana],
                      [t("kundli.results.weekday"), detail.panchang.weekday],
                      [t("kundli.results.sunrise"), fmtTime(detail.panchang.sunrise)],
                      [t("kundli.results.sunset"), fmtTime(detail.panchang.sunset)],
                      [
                        t("kundli.results.rahuKaal"),
                        detail.panchang.inauspicious?.rahuKaal
                          ? `${fmtTime(detail.panchang.inauspicious.rahuKaal.start)} – ${fmtTime(
                              detail.panchang.inauspicious.rahuKaal.end
                            )}`
                          : "—",
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-celestial-950/40 p-4 text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">
                          {label}
                        </div>
                        <div className="text-sm font-semibold text-slate-200">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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
