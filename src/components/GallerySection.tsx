import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { api, type GalleryItem } from "@/lib/data";

export default function GallerySection({ limit }: { limit?: number }) {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.gallery().then(setItems);
  }, []);

  const list = (limit ? items.slice(0, limit) : items).filter(
    (i) => i.type === "image"
  );

  return (
    <section id="gallery" className="py-24 px-4 bg-celestial-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            {t("gallery.title")}
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("gallery.subtitle")}</p>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gold-500/10 rounded-3xl">
            <p className="text-slate-500 font-serif italic text-xl">{t("gallery.empty")}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {list.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl"
              >
                {item.type === "video" ? (
                  <div className="relative">
                    <video
                      src={item.url}
                      className="w-full h-auto"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-celestial-950">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={isHindi ? item.caption_hi : item.caption_en}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-celestial-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium text-sm">
                    {isHindi ? item.caption_hi : item.caption_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
