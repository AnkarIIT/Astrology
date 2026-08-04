import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { api, type Booking, whatsappLink } from "@/lib/data";
import { EmptyState } from "./common";

type Status = "pending" | "confirmed" | "done" | "cancelled";
const STATUSES: Status[] = ["pending", "confirmed", "done", "cancelled"];

export default function BookingsTab() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      const sb = await import("@/lib/supabase").then((m) => m.getSupabase());
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(t("admin.loadError"));
        return;
      }
      setBookings((data as Booking[]) || []);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [t]);

  const setStatus = async (id: string, status: Status) => {
    try {
      await api.updateBooking(id, { status });
      setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.deleteBooking(id);
      setBookings((b) => b.filter((x) => x.id !== id));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  if (bookings.length === 0 && !error) {
    return <EmptyState text={t("admin.noBookings")} />;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {bookings.map((booking) => (
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

              <div className="text-xs">
                {t("admin.payment")}:{" "}
                <span className={booking.payment_status === "paid" ? "text-green-400" : "text-amber-400"}>
                  {booking.payment_status === "paid"
                    ? `${t("admin.paid")} ${booking.payment_id ? `(${booking.payment_id})` : ""}`
                    : `${t("admin.notPaid")}${booking.amount > 0 ? ` (₹${booking.amount})` : ""}`}
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
      ))}
    </div>
  );
}
