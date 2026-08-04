import { Star, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="py-20 px-4 bg-celestial-950 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-8 h-8 text-gold-400 fill-gold-400/20" />
              <span className="text-2xl font-serif font-bold gold-gradient">Celestial Insights</span>
            </div>
            <p className="text-slate-400 max-w-md mb-8">
              Empowering individuals through the ancient wisdom of astrology. Our mission is to provide clarity and guidance for a more harmonious life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gold-300 font-serif font-bold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-slate-400 hover:text-gold-300 transition-colors">Home</a></li>
              <li><a href="#services" className="text-slate-400 hover:text-gold-300 transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-slate-400 hover:text-gold-300 transition-colors">Gallery</a></li>
              <li><a href="#testimonials" className="text-slate-400 hover:text-gold-300 transition-colors">Testimonials</a></li>
              <li><a href="#blog" className="text-slate-400 hover:text-gold-300 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-300 font-serif font-bold text-xl mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-gold-500" />
                <span>info@celestialinsights.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-gold-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span>123 Cosmic Way, Nebula City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm flex flex-col items-center gap-4">
          <p>© {new Date().getFullYear()} Celestial Insights. All rights reserved. Guided by the stars.</p>
          <button 
            onClick={() => {
              // This will trigger the global custom event that Blog.tsx can listen to
              window.dispatchEvent(new CustomEvent('toggle-admin'));
            }}
            className="opacity-10 hover:opacity-100 transition-opacity text-[10px] uppercase tracking-widest"
          >
            Owner Access
          </button>
        </div>
      </div>
    </footer>
  );
}
