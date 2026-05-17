import { motion } from 'motion/react';

export function Terms() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      <section className="bg-emerald-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl font-bold">Terms of Service</h1>
        </div>
      </section>
      <section className="py-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="prose prose-stone prose-lg prose-headings:font-serif prose-headings:text-emerald-950 prose-p:text-stone-500 prose-p:leading-relaxed">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-8">Nourishing our Collective Rights.</h2>
            <p className="mb-8">
              By accessing Nourish Kitchen, you agree to these terms. Please read them carefully, as they outline your rights and responsibilities when engaging with our platform.
            </p>

            <h3 className="text-2xl font-bold mt-12 mb-6">1. Ethical Usage</h3>
            <p className="mb-6">
              Our recipes are cultural artifacts. We ask that you:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>Respect the heritage and origin of each technique.</li>
              <li>Use the platform for positive culinary exploration.</li>
              <li>Refrain from scraping or redistributing our content commercially without consent.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">2. Member Contributions</h3>
            <p className="mb-6">
              When you share a recipe:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>You retain ownership of your original ideas.</li>
              <li>You grant Nourish Kitchen a non-exclusive license to showcase your contribution to the community.</li>
              <li>You warrant that you have the right to share the content.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">3. Content Accuracy</h3>
            <p className="mb-8">
              While we strive for precision, culinary results may vary based on ingredients, equipment, and personal skill. Nourish Kitchen is not liable for outcomes following our recipes.
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
