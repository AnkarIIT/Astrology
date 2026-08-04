import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Calendar, Clock, MapPin, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    tob: '',
    pob: '',
    concern: ''
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener('open-booking', handleOpen);
    return () => window.removeEventListener('open-booking', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage for Owner
    const existing = JSON.parse(localStorage.getItem('celestial_bookings') || '[]');
    const newBooking = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };
    
    localStorage.setItem('celestial_bookings', JSON.stringify([newBooking, ...existing]));
    
    setIsSubmitted(true);
    setFormData({ name: '', phone: '', dob: '', tob: '', pob: '', concern: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-celestial-950/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass border-gold-500/20 w-full max-w-2xl p-8 rounded-3xl relative overflow-hidden"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <h3 className="text-3xl font-serif font-bold text-gold-300 mb-2">Book Your Consultation</h3>
                  <p className="text-slate-400">Please provide your details for an accurate astrological reading.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3 text-gold-500" /> Full Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                        placeholder="Arjun Singh"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gold-500" /> WhatsApp Number
                      </label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gold-500" /> Date of Birth
                      </label>
                      <input 
                        required
                        type="date" 
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gold-500" /> Time of Birth
                      </label>
                      <input 
                        required
                        type="time" 
                        value={formData.tob}
                        onChange={(e) => setFormData({...formData, tob: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gold-500" /> Place of Birth
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.pob}
                        onChange={(e) => setFormData({...formData, pob: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase tracking-widest">Main Concern / Question</label>
                    <textarea 
                      required
                      value={formData.concern}
                      onChange={(e) => setFormData({...formData, concern: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 h-32"
                      placeholder="Ask about career, marriage, health etc."
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Send Request
                  </Button>
                </form>
              </>
            ) : (
              <div className="py-12 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-celestial-950" />
                </motion.div>
                <h3 className="text-3xl font-serif font-bold text-gold-300 mb-4">Request Sent!</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  Your divine request has been received. Dhiraj will connect with you on WhatsApp shortly to schedule your session.
                </p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent border border-gold-500/30 text-gold-300 hover:bg-gold-500/10 px-8 h-12 rounded-full"
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
