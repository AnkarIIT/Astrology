import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Hero />
      <ServicesSection limit={6} />
      <GallerySection limit={6} />
      <TestimonialsSection />
      <BlogSection limit={3} />

      <section className="py-24 px-4 bg-celestial-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t("kundli.title")}
          </h2>
          <p className="text-slate-400 mb-10">{t("kundli.subtitle")}</p>
          <Link to="/kundli">
            <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-bold px-10 py-6 text-lg rounded-full">
              {t("kundli.calculate")}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
