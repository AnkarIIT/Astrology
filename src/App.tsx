import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Blog from "./components/Blog";
import WorkGallery from "./components/WorkGallery";
import Footer from "./components/Footer";
import CelestialBackground from "./components/CelestialBackground";
import BookingModal from "./components/BookingModal";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <div className="relative min-h-screen bg-celestial-950">
      <div className="fixed inset-0 z-0">
        <CelestialBackground />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <WorkGallery />
          <Testimonials />
          <Blog />
        </main>
        <Footer />
        <BookingModal />
        <AdminDashboard />
      </div>
    </div>
  );
}
