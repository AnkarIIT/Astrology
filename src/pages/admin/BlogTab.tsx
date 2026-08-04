import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2, Pencil, Upload } from "lucide-react";
import { api, type BlogPost } from "@/lib/data";
import { uploadFile } from "@/lib/storage";
import { Modal, EmptyState, inputCls, labelCls } from "./common";
import { Button } from "@/components/ui/button";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const blank = {
  slug: "",
  title_en: "",
  title_hi: "",
  content_en: "",
  content_hi: "",
  category_en: "Article",
  category_hi: "लेख",
  image_url: "",
  type: "blog",
  published: true,
};

export default function BlogTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.adminBlog().then(setItems).catch(() => setError(t("admin.loadError")));
  }, [t]);

  const openNew = () => setEditing({ ...blank });
  const openEdit = (p: BlogPost) => setEditing({ ...p });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload = {
        ...editing,
        slug: editing.slug || slugify(editing.title_en || ""),
      };
      await api.upsertBlog(payload);
      setItems(await api.adminBlog());
      setEditing(null);
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.deleteBlog(id);
      setItems((l) => l.filter((x) => x.id !== id));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const pickImage = async (file: File | undefined) => {
    if (!file || !editing) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "blog");
      setEditing({ ...editing, image_url: url });
    } catch {
      setError("Upload failed. Check storage bucket 'media' exists and is public.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew} className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> {t("blog.add")}
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {items.length === 0 ? (
        <EmptyState text={t("blog.empty")} />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-gold-500/30">
              <div className="flex items-center gap-4 min-w-0">
                {p.image_url && (
                  <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-gold-300 font-semibold truncate">
                    {p.title_en} {!p.published && <span className="text-amber-400 text-xs">(draft)</span>}
                  </div>
                  <div className="text-xs text-slate-500">
                    /blog/{p.slug} · {p.category_en} · {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 bg-white/5 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 rounded-lg" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(p.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg" title={t("gallery.delete")}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Post" : "New Post"} wide>
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
                <label className={labelCls}>Content (English)</label>
                <textarea required value={editing.content_en || ""} onChange={(e) => setEditing({ ...editing, content_en: e.target.value })} className={inputCls + " h-40"} />
              </div>
              <div>
                <label className={labelCls}>Content (हिंदी)</label>
                <textarea required value={editing.content_hi || ""} onChange={(e) => setEditing({ ...editing, content_hi: e.target.value })} className={inputCls + " h-40"} />
              </div>
              <div>
                <label className={labelCls}>Slug (URL)</label>
                <input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-from-title" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category (EN)</label>
                  <input value={editing.category_en || ""} onChange={(e) => setEditing({ ...editing, category_en: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category (HI)</label>
                  <input value={editing.category_hi || ""} onChange={(e) => setEditing({ ...editing, category_hi: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Cover Image</label>
              <div className="flex items-center gap-4">
                {editing.image_url && (
                  <img src={editing.image_url} alt="" className="w-24 h-16 rounded-lg object-cover" />
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-dashed border-white/20 hover:border-gold-500/50 rounded-xl text-sm text-slate-300 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0])} />
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4 accent-gold-500" />
              Published (visible on website)
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
