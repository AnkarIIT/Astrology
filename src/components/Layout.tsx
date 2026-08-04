import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CelestialBackground from "./CelestialBackground";
import WhatsAppButton from "./WhatsAppButton";
import Seo from "./Seo";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-celestial-950">
      <div className="fixed inset-0 z-0">
        <CelestialBackground />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Seo />
      <WhatsAppButton />
    </div>
  );
}
