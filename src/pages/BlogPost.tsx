import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { api, type BlogPost } from "@/lib/data";

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === "hi";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.blog().then((list) => {
      const found = list.find((p) => p.slug === slug);
      if (found) setPost(found);
      else setNotFound(true);
    });
  }, [slug]);

  if (notFound) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <h1 className="text-4xl font-serif font-bold text-gold-300 mb-6">{t("blog.noPost")}</h1>
        <Link to="/blog">
          <Button variant="outline" className="border-gold-500/30 text-gold-300">
            <ArrowLeft className="w-4 h-4" /> {t("blog.back")}
          </Button>
        </Link>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="pt-40 pb-24 px-4 text-center">
        <p className="text-slate-400">{t("misc.loading")}</p>
      </section>
    );
  }

  const content = isHindi ? post.content_hi : post.content_en;

  return (
    <article className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {t("blog.back")}
        </Link>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={isHindi ? post.title_hi : post.title_en}
            className="w-full max-h-96 object-cover rounded-3xl border border-gold-500/10 mb-8"
            loading="lazy"
          />
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold-500" />
            {new Date(post.created_at).toLocaleDateString(
              i18n.language === "hi" ? "hi-IN" : "en-US",
              { month: "long", day: "numeric", year: "numeric" }
            )}
          </span>
          <span className="text-gold-400">{isHindi ? post.category_hi : post.category_en}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-300 mb-8">
          {isHindi ? post.title_hi : post.title_en}
        </h1>

        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </article>
  );
}
