import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Phone, Calendar, Clock, MapPin, MessageSquare, X, CheckSquare } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  phone: string;
  dob: string;
  tob: string;
  pob: string;
  concern: string;
  status: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Sync admin state
    const checkAdmin = () => {
      // Since Blog.tsx toggles it via secret key, we can use a small hack or sync via event
      // However, for simplicity let's listen for the same event
      const handleToggle = () => setIsAdmin(prev => !prev);
      window.addEventListener('toggle-admin', handleToggle);
      return () => window.removeEventListener('toggle-admin', handleToggle);
    };
    checkAdmin();

    // Load bookings
    const load = () => {
      const saved = localStorage.getItem('celestial_bookings');
      if (saved) setBookings(JSON.parse(saved));
    };
    load();
    
    // Refresh bookings when dashboard is opened or when new ones might arrive
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('celestial_bookings', JSON.stringify(updated));
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating Dashboard Toggle */}
      <button 
        onClick={() => setShowDashboard(true)}
        className="fixed bottom-24 right-6 z-40 bg-gold-500 text-celestial-950 p-4 rounded-full shadow-2xl shadow-gold-500/50 hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-bold hidden group-hover:block pr-2">See Requests ({bookings.length})</span>
      </button>

      <AnimatePresence>
        {showDashboard && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-celestial-950/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass border-gold-500/20 w-full max-w-5xl h-[80vh] flex flex-col p-8 rounded-3xl relative"
            >
              <button 
                onClick={() => setShowDashboard(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-serif font-bold text-gold-300">Consultation Requests</h3>
                <p className="text-slate-500">Manage your incoming bookings and details.</p>
              </div>

              <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {bookings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
                    <CheckSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p className="italic">No pending requests yet.</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-gold-400">{booking.name}</h4>
                            <span className="text-[10px] text-slate-600 uppercase tracking-widest">{booking.timestamp}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Phone className="w-4 h-4 text-gold-500" />
                              <a href={`https://wa.me/${booking.phone.replace(/\D/g,'')}`} target="_blank" className="hover:text-gold-400 underline">{booking.phone}</a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Calendar className="w-4 h-4 text-gold-500" />
                              {booking.dob}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-4 h-4 text-gold-500" />
                              {booking.tob}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <MapPin className="w-4 h-4 text-gold-500" />
                              {booking.pob}
                            </div>
                          </div>

                          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                            <p className="text-sm text-slate-300 italic">"{booking.concern}"</p>
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-2">
                          <button 
                            onClick={() => deleteBooking(booking.id)}
                            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                            title="Delete Request"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <a 
                            href={`https://wa.me/${booking.phone.replace(/\D/g,'')}`}
                            target="_blank"
                            className="p-3 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-xl transition-all"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
