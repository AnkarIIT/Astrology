import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Mail } from "lucide-react";
import { api, OWNER_WHATSAPP, type KundliLead, type ContactMessage } from "@/lib/data";
import { EmptyState } from "./common";

export default function LeadsTab() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<KundliLead[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [tab, setTab] = useState<"kundli" | "contact">("kundli");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .kundliLeads()
      .then(setLeads)
      .catch(() => setError(t("admin.loadError")));
    api
      .contactMessages()
      .then(setMessages)
      .catch(() => setError(t("admin.loadError")));
  }, [t]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["kundli", "contact"] as const).map((tp) => (
          <button
            key={tp}
            onClick={() => setTab(tp)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === tp ? "bg-gold-500 text-celestial-950" : "bg-white/5 text-slate-400"
            }`}
          >
            {tp === "kundli" ? "Kundli Leads" : "Contact Messages"}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {tab === "kundli" ? (
        leads.length === 0 ? (
          <EmptyState text="No kundli leads yet" />
        ) : (
          <div className="space-y-3">
            {leads.map((l) => (
              <div key={l.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <div className="text-gold-300 font-semibold">
                      {l.name || "Anonymous"} · {formatDate(l.dob)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {l.pob || "—"} · {l.tob || "—"} · {formatDate(l.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : messages.length === 0 ? (
        <EmptyState text="No contact messages yet" />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gold-300 font-semibold">
                  <Mail className="w-4 h-4" /> {m.name}
                </div>
                <span className="text-[10px] text-slate-600">{formatDate(m.created_at)}</span>
              </div>
              {m.email && (
                <a href={`mailto:${m.email}`} className="text-sm text-gold-400 hover:underline">{m.email}</a>
              )}
              <p className="text-sm text-slate-300 mt-2 italic">"{m.message}"</p>
            </div>
          ))}
        </div>
      )}
      {leads.length > 0 && tab === "kundli" && (
        <p className="mt-6 text-xs text-slate-500">
          Tip: Use these leads for WhatsApp follow-up via{" "}
          <a href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-gold-400">
            your WhatsApp
          </a>
        </p>
      )}
    </div>
  );
}
