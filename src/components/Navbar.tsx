import { motion } from "motion/react";
import { Star, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const navLinks = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "services", to: "/services" },
  { key: "kundli", to: "/kundli" },
  { key: "horoscope", to: "/horoscope" },
  { key: "gallery", to: "/gallery" },
  { key: "blog", to: "/blog" },
  { key: "contact", to: "/contact" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2"
              >
                <Star className="w-8 h-8 text-gold-400 fill-gold-400/20" />
                <span className="text-2xl font-serif font-bold gold-gradient">
                  {t("brand.name")}
                </span>
              </motion.div>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  className={
                    "px-2 py-2 rounded-md text-sm font-medium transition-colors " +
                    (location.pathname === link.to
                      ? "text-gold-300"
                      : "text-slate-300 hover:text-gold-300")
                  }
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(i18n.language === "en" ? "hi" : "en")}
              className="px-3 py-1.5 rounded-lg border border-gold-500/30 text-gold-300 text-xs font-semibold hover:bg-gold-500/10 transition-colors"
              aria-label="Switch language"
            >
              {i18n.language === "en" ? "हिंदी" : "EN"}
            </button>

            <Link to="/book" className="hidden md:block">
              <Button className="bg-gold-500 hover:bg-gold-600 text-celestial-950 font-semibold rounded-full">
                {t("nav.book")}
              </Button>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-300 hover:text-gold-300 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass border-t border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                className="text-slate-300 hover:text-gold-300 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            <Link
              to="/book"
              className="block px-3 py-2 rounded-md text-base font-semibold text-gold-400"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.book")}
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
