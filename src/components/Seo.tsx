import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const SITE = "Celestial Insights | Astrologer Dhiraj";

const META: { title: string; description: string }[] = [
  {
    title: SITE,
    description:
      "Expert astrological guidance by Dhiraj. Birth chart analysis, kundli, horoscope, vastu and spiritual healing. Book your consultation today.",
  },
  { title: `About ${SITE}`, description: "Learn about astrologer Dhiraj and Celestial Insights." },
  { title: `Services ${SITE}`, description: "Kundli analysis, relationship compatibility, career guidance, yearly forecast, spiritual healing and vastu." },
  { title: `Free Kundli Calculator ${SITE}`, description: "Get your Vedic kundli instantly - Lagna, Rashi, Nakshatra, planetary positions and Vimshottari dasha." },
  { title: `Daily Horoscope ${SITE}`, description: "Daily, weekly and monthly Vedic horoscope for all 12 rashi signs." },
  { title: `Blog ${SITE}`, description: "Cosmic insights, videos and spiritual guidance from Dhiraj." },
  { title: `Gallery ${SITE}`, description: "Glimpses into the divine rituals and spiritual services performed by Dhiraj." },
  { title: `Testimonials ${SITE}`, description: "Read what clients say about their journey with Celestial Insights." },
  { title: `Contact ${SITE}`, description: "Reach out for questions or to schedule a consultation with Dhiraj." },
  { title: `Book a Consultation ${SITE}`, description: "Book a private consultation with astrologer Dhiraj online." },
  { title: `Admin ${SITE}`, description: "Admin dashboard." },
];

function metaFor(pathname: string) {
  if (pathname.startsWith("/services")) return META[2];
  if (pathname.startsWith("/blog")) return META[5];
  if (pathname.startsWith("/kundli")) return META[3];
  if (pathname.startsWith("/horoscope")) return META[4];
  if (pathname.startsWith("/gallery")) return META[6];
  if (pathname.startsWith("/testimonials")) return META[7];
  if (pathname.startsWith("/contact")) return META[8];
  if (pathname.startsWith("/book")) return META[9];
  if (pathname.startsWith("/admin")) return META[10];
  if (pathname.startsWith("/about")) return META[1];
  return META[0];
}

export default function Seo() {
  const { pathname } = useLocation();
  const meta = metaFor(pathname);

  useEffect(() => {
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.description);
    trackPageView(pathname);
  }, [meta.title, meta.description, pathname]);

  return null;
}
