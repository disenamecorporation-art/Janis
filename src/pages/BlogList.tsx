import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/db';
import { BlogPost } from '../data/posts';

type CategoryFilter = 'Todos' | 'Trauma somático' | 'Sistema nervioso' | 'Pareja' | 'Límites y autocuidado' | 'Apego';

export const BlogList: React.FC = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => dbService.getPosts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos');
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const handleUpdate = () => setAllPosts(dbService.getPosts());
    window.addEventListener('janis_db_posts_change', handleUpdate);
    return () => window.removeEventListener('janis_db_posts_change', handleUpdate);
  }, []);

  const categories: CategoryFilter[] = [
    'Todos',
    'Trauma somático',
    'Sistema nervioso',
    'Pareja',
    'Límites y autocuidado',
    'Apego',
  ];

  // Featured article is the first one
  const featuredPost = allPosts[0];

  // Filter articles based on search & category
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'Todos' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.some((para) => para.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    setSubSuccess(true);
    setEmailSub('');
  };

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-screen">
      
      {/* Ambient background bloom */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E3A8A]">
            Blog · <span className="text-[#D6567F]">Psicoterapia con Janis</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4B5675] leading-relaxed">
            Herramientas, reflexiones y conocimiento clínico para sanar desde el cuerpo y los vínculos.
          </p>
        </div>

        {/* Search Bar & Category Pills (Glass) */}
        <div className="max-w-4xl mx-auto mb-14 space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, palabra clave o síntoma..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5BD6] focus:bg-white shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-700"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Filter Pills (Functional segment buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'btn-primary-gradient text-white shadow-sm scale-105'
                      : 'bg-white/80 backdrop-blur-md text-slate-600 hover:text-[#1E3A8A] hover:bg-white border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post (Only show if no search/filter or if it matches) */}
        {selectedCategory === 'Todos' && !searchQuery && (
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#D6567F] mb-4">
              Artículo Destacado
            </h2>
            <div className="glass-card rounded-[28px] overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                
                {/* Image */}
                <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[400px] overflow-hidden bg-slate-100">
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-[#D6567F] bg-pink-50 border border-pink-100">
                      {featuredPost.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A] leading-snug group-hover:text-[#2F5BD6] transition-colors">
                      <Link to={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-[#4B5675] leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{featuredPost.date}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{featuredPost.readTime}</span>
                    </div>

                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="font-bold text-[#2F5BD6] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Section title for all articles */}
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#1E3A8A]">
            {selectedCategory === 'Todos' ? 'Todos los artículos' : `Artículos sobre ${selectedCategory}`}
          </h2>
          <span className="text-xs text-slate-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        {/* Grid of Articles */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl max-w-xl mx-auto p-8">
            <p className="text-base text-slate-600 mb-2 font-medium">No se encontraron artículos con ese criterio de búsqueda.</p>
            <p className="text-xs text-slate-400 mb-4">Prueba con palabras como "cuerpo", "límites", "apego" o "ansiedad".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="px-5 py-2 rounded-full text-xs font-semibold text-[#1E3A8A] bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, visibleCount).map((post) => (
              <article
                key={post.slug}
                className="glass-card rounded-[24px] overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div>
                  {/* Post Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#D6567F] border border-pink-100 shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A] line-clamp-2 group-hover:text-[#2F5BD6] transition-colors mb-2.5 leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4B5675] line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom meta */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.date}</span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.readTime}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="font-semibold text-[#2F5BD6] hover:text-[#1E3A8A] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Leer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredPosts.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-8 py-3 rounded-full text-sm font-semibold text-[#1E3A8A] bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
            >
              Cargar más artículos
            </button>
          </div>
        )}

        {/* Glass Newsletter Card */}
        <div className="mt-20 max-w-4xl mx-auto glass-card rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#D6567F] flex items-center justify-center mx-auto border border-pink-100">
              <Mail className="w-6 h-6 stroke-[1.8]" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
              Recibe herramientas para regular tu sistema nervioso
            </h3>

            <p className="text-sm text-[#4B5675] leading-relaxed">
              Enviamos reflexiones clínicas y ejercicios somáticos breves una vez cada dos semanas. Sin spam, solo contenido que suma a tu paz.
            </p>

            {subSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-sm text-emerald-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Gracias por unirte! Te hemos enviado un correo de bienvenida.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-full bg-white/90 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5BD6]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-white text-sm font-medium btn-primary-gradient shadow-md whitespace-nowrap cursor-pointer"
                >
                  Suscribirme
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-400">
              Puedes cancelar tu suscripción en cualquier momento con un solo clic.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
