import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlusCircle, Trash2, X, Play, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export default function WorkGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem("celestial_gallery");
    if (saved) {
      setItems(JSON.parse(saved));
    }

    const handleToggle = () => setIsAdmin(prev => !prev);
    window.addEventListener('toggle-admin', handleToggle);
    return () => window.removeEventListener('toggle-admin', handleToggle);
  }, []);

  const saveGallery = (newItems: GalleryItem[]) => {
    setItems(newItems);
    localStorage.setItem("celestial_gallery", JSON.stringify(newItems));
  };

  const addItem = () => {
    if (!newUrl) return;
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      type: newType,
      url: newUrl,
      caption: newCaption || 'Sacred Moment',
    };
    saveGallery([newItem, ...items]);
    setNewCaption('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const deleteItem = (id: string) => {
    saveGallery(items.filter(i => i.id !== id));
  };

  return (
    <section id="gallery" className="py-24 px-4 bg-celestial-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              Sacred <span className="gold-gradient">Moments</span>
            </motion.h2>
            <p className="text-slate-400 max-w-xl">
              Glimpses into the divine rituals and spiritual services performed by Dhiraj.
            </p>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add to Gallery
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gold-500/10 rounded-3xl">
            <p className="text-slate-500 font-serif italic text-xl">The divine gallery is awaiting your work...</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl"
              >
                {isAdmin && (
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="absolute top-2 right-2 z-20 p-2 bg-red-500/20 hover:bg-red-500 text-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {item.type === 'video' ? (
                  <div className="relative">
                    <video 
                      src={item.url} 
                      className="w-full h-auto cursor-pointer"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-celestial-950">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.caption} 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-celestial-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium text-sm">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-celestial-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass border-gold-500/20 w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-gold-300 mb-6">Add Sacred Moment</h3>
              
              <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-celestial-950/50 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setNewType('image')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${newType === 'image' ? 'bg-gold-500 text-celestial-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <ImageIcon className="w-4 h-4" /> Photo
                  </button>
                  <button 
                    onClick={() => setNewType('video')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${newType === 'video' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Action / Caption</label>
                  <input 
                    type="text" 
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Maha Shivratri Puja..."
                    className="w-full bg-celestial-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Upload File</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="gallery-file"
                      accept={newType === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label 
                      htmlFor="gallery-file"
                      className="flex flex-col items-center justify-center gap-2 w-full aspect-video bg-white/5 border border-dashed border-white/20 hover:border-gold-500/50 hover:bg-white/10 rounded-xl cursor-pointer transition-all overflow-hidden"
                    >
                      {newUrl ? (
                        newType === 'video' ? (
                          <video src={newUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={newUrl} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <>
                          <PlusCircle className="w-8 h-8 text-gold-500/30" /> 
                          <span className="text-sm text-slate-400">Select divine {newType}</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={addItem}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg shadow-lg shadow-gold-500/10"
                >
                  Post to Gallery
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
