import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Play, Trash2, PlusCircle, X, Type, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  type: 'blog' | 'video';
  title: string;
  excerpt: string;
  date: string;
  category: string;
  mediaUrl: string;
}

export default function Blog() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newType, setNewType] = useState<'blog' | 'video'>('blog');
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem("celestial_content");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    
    // Listen for custom event from footer
    const handleToggle = () => setIsAdmin(prev => !prev);
    window.addEventListener('toggle-admin', handleToggle);
    
    // Secret listener for admin mode: Ctrl + Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        setIsAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-admin', handleToggle);
    };
  }, []);

  const saveContent = (newItems: ContentItem[]) => {
    setItems(newItems);
    localStorage.setItem("celestial_content", JSON.stringify(newItems));
  };

  const addItem = () => {
    if (!newTitle || !newUrl) return;
    
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle,
      excerpt: newExcerpt,
      category: newCategory || (newType === 'video' ? 'Video' : 'Article'),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mediaUrl: newUrl,
    };
    
    saveContent([newItem, ...items]);
    setNewTitle('');
    setNewExcerpt('');
    setNewCategory('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const deleteItem = (id: string) => {
    saveContent(items.filter(i => i.id !== id));
  };

  return (
    <section id="blog" className="py-24 px-4 bg-celestial-900/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              Cosmic Insights & Videos
            </motion.h2>
            <p className="text-slate-400 max-w-xl">
              {items.length > 0 
                ? "Explore the latest updates and spiritual guidance shared by the owner."
                : "New content coming soon. Stay tuned for celestial updates."}
            </p>
          </div>
          
          <div className="flex gap-4">
            {isAdmin && (
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gold-500 hover:bg-gold-600 text-celestial-950 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Add Content
              </Button>
            )}
            <motion.button 
              whileHover={{ x: 5 }}
              className="text-gold-400 font-medium flex items-center gap-2 group"
            >
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gold-500/10 rounded-3xl">
            <p className="text-slate-500 font-serif italic text-xl">The stars are quiet for now...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-gold-500/10 overflow-hidden group h-full flex flex-col relative">
                  {isAdmin && (
                    <button 
                      onClick={() => deleteItem(post.id)}
                      className="absolute top-2 right-2 z-20 p-2 bg-red-500/20 hover:bg-red-500 text-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    {post.type === 'video' ? (
                      <div className="w-full h-full relative group">
                        {post.mediaUrl.startsWith('data:video/') ? (
                          <video 
                            src={post.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-gold-500/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-celestial-950/40 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-celestial-950 shadow-lg shadow-gold-500/20">
                            <Play className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={post.mediaUrl || "https://picsum.photos/seed/cosmic/600/400"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${post.type === 'video' ? 'bg-purple-500' : 'bg-gold-500'} text-celestial-950 hover:opacity-90 border-none`}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <CardTitle className="text-xl font-serif text-gold-300 group-hover:text-gold-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-slate-400 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <a 
                      href={post.mediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gold-400 text-sm font-medium flex items-center gap-1 group/btn"
                    >
                      {post.type === 'video' ? 'Watch Now' : 'Read More'} 
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Secret Admin Info in Development */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-700 select-none opacity-20 hover:opacity-100 transition-opacity">
            Owner Mode: Ctrl+Alt+A | (C) Celestial Insights
          </p>
        </div>
      </div>

      {/* Add Content Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-celestial-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass border-gold-500/20 w-full max-w-lg p-8 rounded-3xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-gold-300 mb-6">Push New Content</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-celestial-950/50 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setNewType('blog')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${newType === 'blog' ? 'bg-gold-500 text-celestial-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Type className="w-4 h-4" /> Blog
                  </button>
                  <button 
                    onClick={() => setNewType('video')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${newType === 'video' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter catchy title..."
                    className="w-full bg-celestial-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Short Excerpt</label>
                  <textarea 
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    placeholder="What is this about?"
                    className="w-full bg-celestial-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 h-24"
                  />
                </div>

                {newUrl && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-gold-500/30">
                    {newType === 'video' ? (
                      <video src={newUrl} className="w-full h-full object-cover" muted autoPlay loop />
                    ) : (
                      <img src={newUrl} className="w-full h-full object-cover" />
                    )}
                    <button 
                      onClick={() => setNewUrl('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Category</label>
                    <input 
                      type="text" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g. Tips"
                      className="w-full bg-celestial-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase tracking-wider">
                      {newType === 'video' ? 'Upload Video' : 'Upload Image'}
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        id="file-upload"
                        accept={newType === 'video' ? 'video/*' : 'image/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 w-full bg-white/5 border border-dashed border-white/20 hover:border-gold-500/50 hover:bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-pointer transition-all"
                      >
                        {newUrl ? (
                          <span className="text-gold-400 flex items-center gap-2">
                            {newType === 'video' ? <Video className="w-4 h-4" /> : <Play className="w-4 h-4" />} File Selected
                          </span>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4" /> 
                            Choose {newType === 'video' ? 'Video' : 'Image'}
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={addItem}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-celestial-950 h-14 rounded-xl font-bold text-lg mt-4 shadow-lg shadow-gold-500/10"
                >
                  Publish to Website
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
