import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Trash2, Phone, Calendar, Clock, MapPin, LogOut, MessageSquare,
  Loader2, Lock,
} from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { api, type Booking, whatsappLink } from "@/lib/data";

type Status = "pending" | "confirmed" | "done" | "cancelled";

const STATUSES: Status[] = ["pending", "confirmed", "done", "cancelled"];

export default function Admin() {
  const { t } = useTranslation();
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadError, setLoadError] = useState("");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession({ email: data.session.user.email || "" });
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s?.user ? { email: s.user.email || "" } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setLoadError("");
      const sb = getSupabase();
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setLoadError(t("admin.loadError"));
        return;
      }
      setBookings((data as Booking[]) || []);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [session, t]);

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

  const setStatus = async (id: string, status: Status) => {
    try {
      await api.updateBooking(id, { status });
      setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch {
      setLoadError(t("admin.loadError"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.deleteBooking(id);
      setBookings((b) => b.filter((x) => x.id !== id));
    } catch {
      setLoadError(t("admin.loadError"));
    }
  };

  if (!configured) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <div className="max-w-md mx-auto glass rounded-3xl p-10">
          <Lock className="w-10 h-10 text-gold-400 mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gold-300 mb-4">{t("admin.title")}</h1>
          <p className="text-amber-400/90 text-sm mb-6">
            Supabase configure karo (.env.local mein VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) aur
            supabase/schema.sql run karo. Phir supabase.com par ek admin user create karo.
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
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gold-300">{t("admin.bookings")}</h1>
            <p className="text-slate-500 text-sm mt-1">{session.email}</p>
          </div>
          <Button onClick={signOut} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> {t("admin.signOut")}
          </Button>
        </div>

        {loadError && (
          <p className="text-red-400 text-sm mb-6">{loadError}</p>
        )}

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate-500" />
              <p className="text-slate-500 italic">{t("admin.noBookings")}</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-gold-400">{booking.name}</h4>
                      <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                        {new Date(booking.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-4 h-4 text-gold-500" />
                        <a href={whatsappLink(booking.phone)} target="_blank" className="hover:text-gold-400 underline">
                          {booking.phone}
                        </a>
                      </div>
                      {booking.dob && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4 text-gold-500" /> {booking.dob}
                        </div>
                      )}
                      {booking.tob && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4 text-gold-500" /> {booking.tob}
                        </div>
                      )}
                      {booking.pob && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-4 h-4 text-gold-500" /> {booking.pob}
                        </div>
                      )}
                    </div>

                    {booking.service_title && (
                      <div className="text-sm text-gold-400">Service: {booking.service_title}</div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs">
                        {t("admin.payment")}:{" "}
                        <span className={booking.payment_status === "paid" ? "text-green-400" : "text-amber-400"}>
                          {booking.payment_status === "paid"
                            ? `${t("admin.paid")} ${booking.payment_id ? `(${booking.payment_id})` : ""}`
                            : `${t("admin.notPaid")}${booking.amount > 0 ? ` (₹${booking.amount})` : ""}`}
                        </span>
                      </span>
                    </div>

                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                      <p className="text-sm text-slate-300 italic">"{booking.concern}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(booking.id, s)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            booking.status === s
                              ? "bg-gold-500 text-celestial-950"
                              : "bg-white/5 text-slate-400 hover:text-gold-300"
                          }`}
                        >
                          {t(`admin.status.${s}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <a
                      href={whatsappLink(booking.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-xl transition-all"
                      title={t("admin.whatsapp")}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => remove(booking.id)}
                      className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                      title={t("gallery.delete")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
