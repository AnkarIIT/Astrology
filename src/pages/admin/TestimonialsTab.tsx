import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2, Pencil, Star } from "lucide-react";
import { api, type Testimonial } from "@/lib/data";
import { Modal, EmptyState, inputCls, labelCls } from "./common";
import { Button } from "@/components/ui/button";

const blank = {
  name: "",
  role: "",
  content_en: "",
  content_hi: "",
  rating: 5,
  active: true,
};

export default function TestimonialsTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.adminTestimonials().then(setItems).catch(() => setError(t("admin.loadError")));
  }, [t]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await api.upsertTestimonial(editing);
      setItems(await api.adminTestimonials());
      setEditing(null);
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(id);
      setItems((l) => l.filter((x) => x.id !== id));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setEditing({ ...blank })} className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {items.length === 0 ? (
        <EmptyState text="No testimonials yet. Add your first one to build trust." />
      ) : (
        <div className="space-y-3">
          {items.map((tm) => (
            <div key={tm.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-gold-500/30">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-gold-300 font-semibold">{tm.name}</span>
                  <span className="flex gap-0.5 text-gold-400">
                    {Array.from({ length: Math.min(tm.rating, 5) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </span>
                  {!tm.active && <span className="text-amber-400 text-xs">(hidden)</span>}
                </div>
                <div className="text-xs text-slate-500">{tm.role}</div>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{tm.content_en}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing({ ...tm })} className="p-2 bg-white/5 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 rounded-lg" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(tm.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg" title={t("gallery.delete")}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Testimonial" : "New Testimonial"}>
        {editing && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Content (English)</label>
                <textarea required value={editing.content_en || ""} onChange={(e) => setEditing({ ...editing, content_en: e.target.value })} className={inputCls + " h-28"} />
              </div>
              <div>
                <label className={labelCls}>Content (हिंदी)</label>
                <textarea required value={editing.content_hi || ""} onChange={(e) => setEditing({ ...editing, content_hi: e.target.value })} className={inputCls + " h-28"} />
              </div>
              <div>
                <label className={labelCls}>Rating (1-5)</label>
                <input type="number" min={1} max={5} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className={inputCls} />
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
