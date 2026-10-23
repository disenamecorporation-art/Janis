import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { dbService } from '../services/db';
import { BlogPost } from '../data/posts';
import { CLINIC_INFO, getWhatsAppUrl } from '../config';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const post = slug ? dbService.getPostBySlug(slug) : undefined;

  // Scroll to top only on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (post) {
      document.title = `${post.title} | Psicoterapia con Janis`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
      }
    }
  }, [slug]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    const text = encodeURIComponent(`Te comparto esta lectura de Psicoterapia con Janis: "${post.title}"\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!post) {
    return (
      <div className="pt-36 pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A8A] mb-3">Artículo no encontrado</h1>
        <p className="text-slate-500 mb-6">El artículo que buscas no existe o ha sido movido.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm btn-primary-gradient shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al blog</span>
        </Link>
      </div>
    );
  }

  // Related posts (same category or others, excluding current)
  const relatedPosts = dbService.getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pt-28 md:pt-36 pb-24 relative min-h-screen">
      
      {/* Top Reading Progress Bar (Pink-to-Blue Gradient) */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-[#C2477A] to-[#5B6FD6] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a todos los artículos</span>
          </Link>
        </div>

        {/* Header Block */}
        <header className="space-y-6 mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold text-[#D6567F] bg-pink-50 border border-pink-100">
            {post.category}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E3A8A] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author row & Meta */}
          <div className="pt-4 border-y border-slate-200/60 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/janis-sobre-mi.png"
                alt="Janis Niño Vasquez"
                className="w-11 h-11 rounded-full object-cover border-2 border-pink-100"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.postimg.cc/G3Kwkymw/image.png';
                }}
              />
              <div>
                <p className="text-xs font-bold text-[#1E3A8A]">{CLINIC_INFO.doctor}</p>
                <p className="text-[11px] text-slate-500">{CLINIC_INFO.credential}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Large Cover Image */}
        <div className="rounded-[28px] overflow-hidden shadow-xl mb-10 aspect-[16/9] bg-slate-100">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Optional Video Embed */}
        {post.videoUrl && (
          <div className="max-w-[720px] mx-auto mb-10 rounded-2xl overflow-hidden shadow-lg aspect-[16/9] bg-slate-900">
            <iframe
              src={post.videoUrl.includes('watch?v=') ? post.videoUrl.replace('watch?v=', 'embed/') : post.videoUrl}
              title={post.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Optional Additional Images Gallery */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="max-w-[720px] mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.imageUrls.map((imgUrl, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-slate-100">
                <img src={imgUrl} alt={`${post.title} - ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Main Prose Content */}
        <div className="max-w-[720px] mx-auto text-[#4B5675] space-y-6 text-base sm:text-[17px] leading-[1.8] font-normal">
          {post.content.map((paragraph, index) => {
            // Highlight paragraph 2 with a distinctive quote styling if index === 1
            if (index === 1) {
              return (
                <div key={index} className="space-y-6">
                  <p>{paragraph}</p>
                  <blockquote className="my-8 p-6 rounded-2xl glass-card-subtle border-l-4 border-l-[#D6567F] font-serif italic text-lg sm:text-xl text-[#1E3A8A] leading-relaxed">
                    “Tu sistema nervioso no busca castigarte; simplemente está repitiendo las respuestas que en algún momento le permitieron sobrevivir.”
                  </blockquote>
                </div>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}

          {/* Informational clinical disclaimer */}
          <div className="mt-10 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-[#2F5BD6] shrink-0 mt-0.5" />
            <p className="italic">
              Nota clínica: Este contenido es informativo y no sustituye una consulta psicológica ni un diagnóstico clínico profesional. Si experimentas malestar significativo, te invitamos a iniciar un proceso terapéutico guiado.
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="max-w-[720px] mx-auto mt-10 pt-6 border-t border-slate-200/70 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4" />
            Compartir artículo
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
            </button>
          </div>
        </div>

        {/* Glass Author Box */}
        <div className="max-w-[720px] mx-auto mt-14 glass-card rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src="/assets/janis-sobre-mi.png"
            alt={CLINIC_INFO.doctor}
            className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md ring-2 ring-pink-100"
            onError={(e) => {
              e.currentTarget.src = 'https://i.postimg.cc/G3Kwkymw/image.png';
            }}
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A]">
              Escrito por {CLINIC_INFO.doctor}
            </h3>
            <p className="text-xs text-[#D6567F] font-semibold">
              {CLINIC_INFO.credential} · Psicoterapia Somática y EMDR
            </p>
            <p className="text-xs text-[#4B5675] leading-relaxed">
              Acompaño a personas y parejas a sanar las heridas del apego y restablecer la seguridad en su sistema nervioso en Caracas y de forma online para el resto del mundo.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(`Hola Janis, leí tu artículo "${post.title}" y quisiera agendar una sesión terapéutica.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-medium btn-primary-gradient shadow-sm"
              >
                <span>Agendar cita con Janis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA Box */}
        <div className="max-w-[720px] mx-auto mt-10 rounded-3xl p-8 bg-gradient-to-r from-[#EEF4FF] via-[#F4F7FE] to-[#FDF4F8] border border-blue-100/70 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#1E3A8A]">
            ¿Te identificaste con lo que leíste? Hablemos.
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            El primer paso es reconocer lo que tu cuerpo necesita. Te acompaño a encontrar la calma que mereces.
          </p>
          <div className="pt-1">
            <a
              href={getWhatsAppUrl(`Hola Janis, me sentí muy identificado/a con el artículo sobre "${post.category}" y quisiera dar el primer paso.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-medium btn-primary-gradient shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hablar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#1E3A8A]">
              Artículos relacionados
            </h3>
            <Link to="/blog" className="text-xs font-semibold text-[#2F5BD6] hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <article
                key={rel.slug}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-semibold text-[#D6567F] block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#1E3A8A] line-clamp-2 group-hover:text-[#2F5BD6] transition-colors leading-snug">
                      <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                  </div>
                </div>

                <div className="p-5 pt-0 text-xs text-slate-400 flex items-center justify-between">
                  <span>{rel.readTime}</span>
                  <Link to={`/blog/${rel.slug}`} className="font-semibold text-[#2F5BD6]">
                    Leer →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
};
