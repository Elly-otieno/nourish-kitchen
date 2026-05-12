import { motion } from 'motion/react';

export function Privacy() {
  return (
    <div className="bg-white selection:bg-emerald-100">
      <section className="bg-emerald-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="prose prose-stone prose-lg prose-headings:font-serif prose-headings:text-emerald-950 prose-p:text-stone-500 prose-p:leading-relaxed">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-8">Your Privacy and Our Heritage.</h2>
            <p className="mb-8">
              At Nourish Kitchen, we respect your privacy as much as we respect the recipes we preserve. This policy explains how we handle your information when you join our culinary community.
            </p>

            <h3 className="text-2xl font-bold mt-12 mb-6">1. Data We Collect</h3>
            <p className="mb-6">
              Specifically for the purpose of creating your profile and providing personalized recipe recommendations, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>Identity data provided during registration (Name, Email).</li>
              <li>Culinary preferences and dietary requirements you choose to share.</li>
              <li>Technical data related to your visits to our site.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">2. How We Use It</h3>
            <p className="mb-6">
              Your data remains strictly within the Nourish Kitchen ecosystem. We use it to:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-stone-500 mb-8">
              <li>Manage your account and collections.</li>
              <li>Send our kitchen journal and heritage updates (if you subscribe).</li>
              <li>Improve our preservation methodologies.</li>
            </ul>

            <h3 className="text-2xl font-bold mt-12 mb-6">3. Protection</h3>
            <p className="mb-8">
              We implement robust security measures to protect your culinary identity. Your data is encrypted and stored securely. We never sell your personal information to third parties.
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
