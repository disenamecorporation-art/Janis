import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { dbService } from '../services/db';

export const HomeBlogSection: React.FC = () => {
  const [posts, setPosts] = useState(() => dbService.getPosts());

  useEffect(() => {
    const handleUpdate = () => setPosts(dbService.getPosts());
    window.addEventListener('janis_db_posts_change', handleUpdate);
    return () => window.removeEventListener('janis_db_posts_change', handleUpdate);
  }, []);

  const recentPosts = posts.slice(0, 3);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F8FAFD] via-white/80 to-[#F8FAFD]">
      
      {/* Background soft ambient blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E3A8A]">
              Desde el blog
            </h2>
            <p className="text-lg font-medium text-[#D6567F] mt-1">
              Lecturas para regular tu sistema nervioso
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2F5BD6] hover:text-[#1E3A8A] transition-colors group"
          >
            <span>Ver todos los artículos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Glass Cards (Scroll on mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.slug}
              className="glass-card rounded-[24px] overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <div>
                {/* Post Image with zoom effect */}
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
                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A8A] line-clamp-2 group-hover:text-[#2F5BD6] transition-colors mb-2.5 leading-snug">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-[#4B5675] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom meta & read more link */}
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
                  <span>Leer más</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
