import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, History, GlassWater, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Our Heritage</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight">
              A Haven for <br />
              <span className="italic font-normal serif-font">Culinary Time.</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/80 leading-relaxed mb-10 font-medium">
              Nourish Kitchen is a dedicated culinary space where we document, preserve, and share the heritage recipes that define our cultures.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
          <span className="text-[400px] font-serif font-black text-emerald-100/10 select-none translate-x-1/4">N</span>
        </div>
      </section>

      {/* Philosophy Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=1200" 
                  alt="Kitchen Table"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-[40px] -z-10" />
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950">The Art of Retrieval.</h2>
                <p className="text-stone-500 text-lg leading-relaxed font-medium">
                  At Nourish, we believe food is the most resilient record of human history. Every recipe is a story—a record of geography, climate, and community. Our mission is to preserve these traditions and translate them into modern culinary practices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl bg-stone-50 border border-stone-100"
                >
                  <History className="text-emerald-600 mb-4" size={24} />
                  <h4 className="font-bold text-emerald-950 mb-2">Preservation</h4>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">Documenting recipes from elders and traditional archives.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl bg-stone-50 border border-stone-100"
                >
                  <Sparkles className="text-emerald-600 mb-4" size={24} />
                  <h4 className="font-bold text-emerald-950 mb-2">Modernization</h4>
                  <p className="text-sm text-stone-500 leading-relaxed font-medium">Adapting heritage techniques for contemporary kitchens.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats/Values Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-emerald-50 py-24 md:py-32 rounded-[64px] mx-6 md:mx-12 mb-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: '2.5k+', label: 'Collected Recipes' },
              { value: '150+', label: 'Heritage Spices' },
              { value: '12', label: 'Kitchen Stations' },
              { value: '45k', label: 'Global Chefs' },
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="font-serif text-5xl font-bold text-emerald-950 mb-2">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team/Join Section */}
      <section className="pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[64px] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">Ready to Contribute?</h2>
            <p className="text-lg text-stone-400 mb-12 max-w-xl mx-auto">
              We are always looking for food lovers, storytellers, and home chefs to join our project.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                Join our Community
              </Link>
              <Link to="/recipes" className="bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                Explore Recipes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
