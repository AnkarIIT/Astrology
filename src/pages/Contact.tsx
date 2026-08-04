import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { OWNER_WHATSAPP, whatsappLink } from "@/lib/data";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    api.createContact(form).catch(() => {});
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const waLink = OWNER_WHATSAPP
    ? whatsappLink(OWNER_WHATSAPP, `Hello, I have a question.`)
    : "#";

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif font-bold mb-4">{t("contact.title")}</h1>
          <p className="text-slate-400 text-lg">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 flex items-start gap-4">
              <Mail className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div className="text-slate-300">info@celestialinsights.com</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 flex items-start gap-4">
              <Phone className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <div className="text-sm text-slate-500">WhatsApp</div>
                <a href={waLink} className="text-slate-300 hover:text-gold-300">
                  {OWNER_WHATSAPP ? `+${OWNER_WHATSAPP}` : "+91 00000 00000"}
                </a>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 flex items-start gap-4">
              <MapPin className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <div className="text-sm text-slate-500">Location</div>
                <div className="text-slate-300">Varanasi, India</div>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 glass rounded-3xl p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">
                {t("contact.form.name")}
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">
                {t("contact.form.message")}
              </label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 h-32"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> {t("contact.form.send")}
            </Button>
            {sent && (
              <p className="flex items-center justify-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {t("contact.form.success")}
              </p>
            )}
            {!isSupabaseConfigured() && (
              <p className="text-center text-xs text-amber-500/70">
                ⚠ Messages save only after Supabase is configured in .env.local
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
