import { motion } from 'motion/react';

export function Cookies() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      <section className="bg-emerald-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl font-bold">Cookie Policy</h1>
        </div>
      </section>
      <section className="py-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="prose prose-stone prose-lg prose-headings:font-serif prose-headings:text-emerald-950 prose-p:text-stone-500 prose-p:leading-relaxed">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-8">A Better Experience.</h2>
            <p className="mb-8">
              We use small data files called "cookies" to enhance your journey through our kitchen. This policy details how they help us provide a seamless experience.
            </p>

            <h3 className="text-2xl font-bold mt-12 mb-6">1. Essential Cookies</h3>
            <p className="mb-6">
              These are necessary for the platform to function. They handle:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>Recognizing you when you sign in.</li>
              <li>Keeping your current session secure.</li>
              <li>Maintaining your preference settings.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">2. Analytical Cookies</h3>
            <p className="mb-6">
              These help us understand how chefs use our platform so we can improve it. We track:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>Which recipes are the most popular.</li>
              <li>How users navigate between different kitchen sections.</li>
              <li>Performance metrics to ensure fast loading times.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">3. Your Control</h3>
            <p className="mb-8">
              Most web browsers allow you to control cookies through their settings. You can choose to block or delete them, though some features of the platform may not work correctly as a result.
            </p>

            <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100 mt-20">
              <p className="text-sm font-sans font-bold text-stone-400 uppercase tracking-widest mb-4">Last Updated</p>
              <p className="text-emerald-950 font-serif italic text-lg line-clamp-1">April 2026</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
