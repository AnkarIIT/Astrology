import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User, Phone, Calendar, Clock, MapPin, Send, CheckCircle2, Mail, MessageCircle,
} from "lucide-react";
import { api, type Booking, type Service, OWNER_WHATSAPP, whatsappLink } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { openRazorpay, isRazorpayConfigured } from "@/lib/razorpay";

export default function Book() {
  const { t } = useTranslation();
  const [params] = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    tob: "",
    pob: "",
    concern: "",
    serviceId: params.get("service") || "",
  });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.services().then(setServices);
  }, []);

  const selectedService = services.find((s) => s.id === form.serviceId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSupabaseConfigured()) {
      setError("Booking requires Supabase. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
      return;
    }
    try {
      const created = await api.createBooking({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        dob: form.dob || undefined,
        tob: form.tob || undefined,
        pob: form.pob || undefined,
        concern: form.concern,
        service_id: selectedService?.id,
        service_title: selectedService?.title_en,
        amount: selectedService?.price || 0,
      });
      setBooking(created);
    } catch {
      setError(t("misc.error"));
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      await openRazorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        amount: booking.amount,
        name: t("brand.name"),
        description: booking.service_title || t("booking.service"),
        prefill: { name: booking.name, contact: booking.phone, email: booking.email || undefined },
        onSuccess: async (paymentId) => {
          await api.updateBooking(booking.id, { payment_status: "paid", payment_id: paymentId });
          setBooking({ ...booking, payment_status: "paid", payment_id: paymentId });
          setPaying(false);
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      setPaying(false);
      setError(t("misc.error"));
    }
  };

  const ownerChat =
    booking && OWNER_WHATSAPP
      ? whatsappLink(
          OWNER_WHATSAPP,
          `New booking request from ${booking.name} (${booking.phone}). Service: ${booking.service_title || "-"}. Concern: ${booking.concern}`
        )
      : null;

  const inputCls =
    "w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50";

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif font-bold mb-4">{t("booking.title")}</h1>
          <p className="text-slate-400">{t("booking.subtitle")}</p>
        </motion.div>

        {!booking ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-gold-500" /> {t("booking.service")}
              </label>
              <select
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className={inputCls}
              >
                <option value="">{t("booking.selectService")}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title_en} {s.price > 0 ? `(₹${s.price})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3 text-gold-500" /> {t("booking.name")}
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="Arjun Singh"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gold-500" /> {t("booking.whatsapp")}
                </label>
                <input
                  required
                  type="tel"
                  pattern="[0-9+\s-]{7,15}"
                  title="Enter a valid phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gold-500" /> {t("booking.email")}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gold-500" /> {t("booking.pob")}
                </label>
                <input
                  type="text"
                  value={form.pob}
                  onChange={(e) => setForm({ ...form, pob: e.target.value })}
                  className={inputCls}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gold-500" /> {t("booking.dob")}
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3 text-gold-500" /> {t("booking.tob")}
                </label>
                <input
                  type="time"
                  value={form.tob}
                  onChange={(e) => setForm({ ...form, tob: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">{t("booking.concern")}</label>
              <textarea
                required
                value={form.concern}
                onChange={(e) => setForm({ ...form, concern: e.target.value })}
                className={inputCls + " h-32"}
                placeholder="Ask about career, marriage, health etc."
              />
            </div>

            {selectedService && selectedService.price > 0 && (
              <div className="glass rounded-2xl p-4 text-sm text-slate-300">
                {t("booking.payTitle")}:{" "}
                <span className="text-gold-400 font-semibold">
                  ₹{selectedService.price} {t("services.perSession")}
                </span>
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> {t("booking.submit")}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-celestial-950" />
            </motion.div>
            <h2 className="text-3xl font-serif font-bold text-gold-300 mb-4">
              {t("booking.successTitle")}
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">{t("booking.successMsg")}</p>

            {booking.amount > 0 && booking.payment_status !== "paid" && isRazorpayConfigured() && (
              <div className="mb-8">
                <p className="text-sm text-slate-400 mb-4">{t("booking.payMsg")}</p>
                <Button
                  onClick={handlePayment}
                  disabled={paying}
                  className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-8 py-6 text-lg rounded-full"
                >
                  {paying ? t("misc.loading") : t("booking.payNow", { amount: booking.amount })}
                </Button>
                <p className="text-xs text-slate-500 mt-3">{t("booking.payLater")}</p>
              </div>
            )}

            {booking.payment_status === "paid" && (
              <p className="text-green-400 text-sm mb-6">
                {t("admin.paid")} {booking.payment_id ? `(${booking.payment_id})` : ""}
              </p>
            )}

            {ownerChat && (
              <a href={ownerChat} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-green-500/40 text-green-400 hover:bg-green-500/10 px-8 py-5 text-base rounded-full flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </Button>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
