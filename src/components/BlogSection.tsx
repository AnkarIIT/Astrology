import { motion } from "motion/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { api, type BlogPost } from "@/lib/data";

export default function BlogSection({ limit }: { limit?: number }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.blog().then(setPosts);
  }, []);

  const list = (limit ? posts.slice(0, limit) : posts).filter(
    (p) => p.type === "blog"
  );

  return (
    <section id="blog" className="py-24 px-4 bg-celestial-900/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            {t("blog.title")}
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {list.length > 0 ? t("blog.subtitleWith") : t("blog.subtitleEmpty")}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gold-500/10 rounded-3xl">
            <p className="text-slate-500 font-serif italic text-xl">{t("blog.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {list.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card className="glass border-gold-500/10 overflow-hidden group h-full flex flex-col relative">
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={isHindi ? post.title_hi : post.title_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-gold-500/50" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gold-500 text-celestial-950 hover:opacity-90 border-none">
                          {isHindi ? post.category_hi : post.category_en}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(
                          i18n.language === "hi" ? "hi-IN" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </div>
                      <CardTitle className="text-xl font-serif text-gold-300 group-hover:text-gold-400 transition-colors">
                        {isHindi ? post.title_hi : post.title_en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-slate-400 text-sm line-clamp-3">
                        {isHindi ? post.content_hi : post.content_en}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <span className="text-gold-400 text-sm font-medium flex items-center gap-1 group/btn">
                        {t("blog.readMore")}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
