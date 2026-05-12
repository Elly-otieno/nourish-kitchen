import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="bg-white selection:bg-emerald-100">
      {/* Hero */}
      <section className="bg-emerald-950 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight">Get in Touch.</h1>
            <p className="text-xl text-emerald-100/70 font-medium italic">
              Share your stories, request a heritage recipe, or simply say hello. We nourish our connection with you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-12"
            >
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-8">Contact Information</h3>
                <div className="space-y-8">
                  {[
                    { icon: Mail, label: 'Email us at', value: 'hello@nourishkitchen.com' },
                    { icon: Phone, label: 'Call us at the kitchen', value: '+1 (555) NOURISH' },
                    { icon: MapPin, label: 'Visit our kitchen', value: '12 Heritage Lane\nZanzibar, Archipelago' },
                  ].map((item, idx) => (
                    <motion.div 
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      viewport={{ once: true }}
                      className="flex items-start gap-6"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{item.label}</p>
                        <p className="font-serif text-lg font-bold text-emerald-950 whitespace-pre-line">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="bg-stone-50 rounded-[4rem] p-10 md:p-16 border border-stone-100">
                {isSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-[400px] flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-emerald-950">Message Sent.</h3>
                    <p className="text-stone-500 max-w-sm font-medium italic">
                      Thank you for nourishing our community. We'll be in touch with you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Your Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-8 py-5 bg-white border border-stone-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Email Address</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-8 py-5 bg-white border border-stone-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Subject</label>
                      <input 
                        required
                        type="text" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-8 py-5 bg-white border border-stone-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Message</label>
                      <textarea 
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-8 py-5 bg-white border border-stone-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium resize-none"
                        placeholder="Let your thoughts flow..."
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-emerald-950 text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                    >
                      Send Message <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
