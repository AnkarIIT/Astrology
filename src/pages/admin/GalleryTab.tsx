import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2, Upload, X } from "lucide-react";
import { api, type GalleryItem } from "@/lib/data";
import { uploadFile } from "@/lib/storage";
import { Modal, EmptyState, inputCls, labelCls } from "./common";
import { Button } from "@/components/ui/button";

export default function GalleryTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [type, setType] = useState<"image" | "video">("image");
  const [captionEn, setCaptionEn] = useState("");
  const [captionHi, setCaptionHi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.adminGallery().then(setItems).catch(() => setError(t("admin.loadError")));
  }, [t]);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "gallery");
      await api.upsertGallery({
        type,
        url,
        caption_en: captionEn,
        caption_hi: captionHi,
      });
      setItems(await api.adminGallery());
      setShowModal(false);
      setFile(null);
      setPreview("");
      setCaptionEn("");
      setCaptionHi("");
    } catch {
      setError("Upload failed. Check storage bucket 'media' exists and is public.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.deleteGallery(id);
      setItems((l) => l.filter((x) => x.id !== id));
    } catch {
      setError(t("admin.loadError"));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowModal(true)} className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> {t("gallery.add")}
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {items.length === 0 ? (
        <EmptyState text={t("gallery.empty")} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-900">
              {g.type === "video" ? (
                <video src={g.url} className="w-full h-32 object-cover" muted />
              ) : (
                <img src={g.url} alt={g.caption_en} className="w-full h-32 object-cover" />
              )}
              <div className="absolute inset-0 bg-celestial-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => remove(g.id)} className="p-2 bg-red-500 text-white rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-1 left-2 right-2 text-[10px] text-slate-400 truncate">
                {g.caption_en}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t("gallery.add")}>
        <form onSubmit={save} className="space-y-5">
          <div className="flex gap-2 p-1 bg-celestial-950/50 rounded-xl border border-white/5">
            {(["image", "video"] as const).map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => { setType(tp); setPreview(""); setFile(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${type === tp ? "bg-gold-500 text-celestial-950" : "text-slate-400"}`}
              >
                {tp === "image" ? "Photo" : "Video"}
              </button>
            ))}
          </div>

          <div>
            <label className={labelCls}>Caption (English)</label>
            <input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Caption (हिंदी)</label>
            <input value={captionHi} onChange={(e) => setCaptionHi(e.target.value)} className={inputCls} />
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden border border-dashed border-white/20 bg-celestial-950/50 flex items-center justify-center">
            {preview ? (
              <>
                {type === "video" ? (
                  <video src={preview} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={preview} className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(""); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer text-slate-400">
                <Upload className="w-8 h-8 text-gold-500/50" />
                <span className="text-sm">Select {type}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept={type === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>

          <Button type="submit" disabled={uploading || !file} className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-12 rounded-xl font-bold">
            {uploading ? "Uploading..." : "Upload & Save"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
