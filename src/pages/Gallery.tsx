import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import GallerySection from "@/components/GallerySection";

export default function Gallery() {
  const { t } = useTranslation();

  return (
    <>
      <section className="pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            {t("gallery.title")}
          </motion.h1>
          <p className="text-slate-400 text-lg">{t("gallery.subtitle")}</p>
        </div>
      </section>
      <GallerySection />
    </>
  );
}
