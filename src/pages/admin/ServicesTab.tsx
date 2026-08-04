import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2, Pencil, Star } from "lucide-react";
import { api, type Service } from "@/lib/data";
import { Modal, EmptyState, inputCls, labelCls } from "./common";
import { Button } from "@/components/ui/button";

const ICONS = ["Compass", "Heart", "Briefcase", "Sun", "Moon", "Shield", "Sparkles", "Stars"];

const blank = {
  title_en: "",
  title_hi: "",
  description_en: "",
  description_hi: "",
  price: 0,
  duration_minutes: 30,
  icon: "Compass",
  order_index: 1,
  active: true,
};

export default function ServicesTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.adminServices().then(setItems).catch(() => setError(t("admin.loadError")));
  }, [t]);

  const openNew = () => setEditing({ ...blank });
  const openEdit = (s: Service) => setEditing({ ...s });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await api.upsertService(editing);
      setItems(await api.adminServices());
      setEditing(null);
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.deleteService(id);
      setItems((l) => l.filter((x) => x.id !== id));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew} className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> {t("services.title")}
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {items.length === 0 ? (
        <EmptyState text={t("misc.loading")} />
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-gold-500/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-gold-300 font-semibold">
                    {s.title_en} {s.price > 0 && <span className="text-slate-400 text-sm">₹{s.price}</span>}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.title_hi} · {s.duration_minutes} {t("services.minutes")} ·{" "}
                    {s.active ? "Active" : "Hidden"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="p-2 bg-white/5 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 rounded-lg" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(s.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg" title={t("gallery.delete")}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Service" : "New Service"} wide>
        {editing && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title (English)</label>
                <input required value={editing.title_en || ""} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Title (हिंदी)</label>
                <input required value={editing.title_hi || ""} onChange={(e) => setEditing({ ...editing, title_hi: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description (English)</label>
                <textarea required value={editing.description_en || ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} className={inputCls + " h-24"} />
              </div>
              <div>
                <label className={labelCls}>Description (हिंदी)</label>
                <textarea required value={editing.description_hi || ""} onChange={(e) => setEditing({ ...editing, description_hi: e.target.value })} className={inputCls + " h-24"} />
              </div>
              <div>
                <label className={labelCls}>Price (₹)</label>
                <input type="number" min={0} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duration (minutes)</label>
                <input type="number" min={5} value={editing.duration_minutes ?? 30} onChange={(e) => setEditing({ ...editing, duration_minutes: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Icon</label>
                <select value={editing.icon || "Compass"} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className={inputCls}>
                  {ICONS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" value={editing.order_index ?? 1} onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-gold-500" />
              Active (visible on website)
            </label>
            <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-12 rounded-xl font-bold">
              Save
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
