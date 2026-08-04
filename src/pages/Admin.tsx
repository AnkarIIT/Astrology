import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, Lock, CalendarCheck, Sparkles, FileText, Image as ImageIcon, Star, Users } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import BookingsTab from "./admin/BookingsTab";
import ServicesTab from "./admin/ServicesTab";
import BlogTab from "./admin/BlogTab";
import GalleryTab from "./admin/GalleryTab";
import TestimonialsTab from "./admin/TestimonialsTab";
import LeadsTab from "./admin/LeadsTab";

type Tab = "bookings" | "services" | "blog" | "gallery" | "testimonials" | "leads";

const TABS: { id: Tab; label: string; icon: typeof CalendarCheck }[] = [
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "services", label: "Services", icon: Sparkles },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "leads", label: "Leads & Messages", icon: Users },
];

export default function Admin() {
  const { t } = useTranslation();
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) setSession({ email: data.session.user.email || "" });
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s?.user ? { email: s.user.email || "" } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) setAuthError(t("admin.authError"));
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/admin" },
    });
    if (error) setAuthError(error.message);
  };

  const signOut = async () => {
    await getSupabase().auth.signOut();
  };

  if (!configured) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <div className="max-w-md mx-auto glass rounded-3xl p-10">
          <Lock className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gold-300 mb-4">{t("admin.title")}</h1>
          <p className="text-amber-400/90 text-sm mb-6">
            Supabase configure karo (.env.local mein VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY),
            supabase/schema.sql run karo, aur supabase.com par ek admin user create karo.
          </p>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Lock className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-gold-300">{t("admin.login")}</h1>
            <p className="text-slate-400 text-sm mt-2">{t("admin.loginDesc")}</p>
          </div>
          <form onSubmit={signIn} className="glass rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">{t("admin.email")}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">{t("admin.password")}</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-celestial-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-12 rounded-xl font-bold"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("admin.signIn")}
            </Button>
            <Button
              type="button"
              onClick={signInGoogle}
              variant="outline"
              className="w-full h-12 rounded-xl border-white/15 text-slate-300"
            >
              {t("admin.signInGoogle")}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gold-300">{t("admin.title")}</h1>
            <p className="text-slate-500 text-sm mt-1">{session.email}</p>
          </div>
          <Button onClick={signOut} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> {t("admin.signOut")}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === id ? "bg-gold-500 text-celestial-950" : "bg-white/5 text-slate-400 hover:text-gold-300"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "leads" && <LeadsTab />}
      </div>
    </section>
  );
}
