import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LegalTerms() {
  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary transition-colors mb-12 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Kingdom
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-stone-200/50"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
            <Shield size={32} />
          </div>
          
          <h1 className="font-serif text-5xl font-bold text-stone-900 mb-8 italic">Legal & Privacy Codex</h1>
          
          <div className="prose prose-stone max-w-none space-y-8 font-sans text-stone-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-stone-900 uppercase tracking-widest mb-4">1. Culinary Intellectual Property</h2>
              <p>All recipes, techniques, and shared heritage records within this platform are protected by digital heritage laws. By participating, you agree not to syndicate or distribute these artifacts without proper attribution to the original curator.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-stone-900 uppercase tracking-widest mb-4">2. The Subscription Pact</h2>
              <p>By subscribing to our newsletter, you grant us permission to send periodic culinary dispatches, laboratory updates, and heritage alerts. We honor your digital sovereignty and will never provide your data to third-party entities.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-stone-900 uppercase tracking-widest mb-4">3. Data Sovereignty</h2>
              <p>We believe in full transparency. Your interaction data is used solely to enhance your experience within the Nourish Laboratory. You have the right to request full extraction or deletion of your records at any time.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-stone-900 uppercase tracking-widest mb-4">4. Community Conduct</h2>
              <p>This is a space of respect and shared growth. Any discourse found to be harmful, discriminatory, or disruptive to our collective pursuit of heritage preservation will result in immediate revocation of laboratory access.</p>
            </section>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Last Updated: April 2026 · Nourish Institutional Registry
        </div>
      </div>
    </div>
  );
}
