import { Star, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OWNER_WHATSAPP, whatsappLink } from "@/lib/data";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { key: "home", to: "/" },
    { key: "about", to: "/about" },
    { key: "services", to: "/services" },
    { key: "kundli", to: "/kundli" },
    { key: "horoscope", to: "/horoscope" },
    { key: "gallery", to: "/gallery" },
    { key: "blog", to: "/blog" },
  ];

  const phoneDisplay = OWNER_WHATSAPP ? `+${OWNER_WHATSAPP}` : "+91 00000 00000";
  const waLink = OWNER_WHATSAPP
    ? whatsappLink(OWNER_WHATSAPP, "Hello, I found your website!")
    : "#";

  return (
    <footer id="contact" className="py-20 px-4 bg-celestial-950 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-8 h-8 text-gold-400 fill-gold-400/20" />
              <span className="text-2xl font-serif font-bold gold-gradient">
                {t("brand.name")}
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-8">{t("footer.about")}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gold-300 font-serif font-bold text-xl mb-6">{t("footer.quickLinks")}</h4>
            <ul className="space-y-4">
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <Link to={l.to} className="text-slate-400 hover:text-gold-300 transition-colors">
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-300 font-serif font-bold text-xl mb-6">{t("footer.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-gold-500" />
                <span>info@celestialinsights.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-gold-500" />
                <a href={waLink} className="hover:text-gold-300">{phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span>Varanasi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
          <p>
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
