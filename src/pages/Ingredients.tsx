import { motion } from 'motion/react';
import { Search, Info, ChefHat, Shrub } from 'lucide-react';

export function Ingredients() {
  const ingredients = [
    { name: "Wild Lavender", type: "Floral", source: "Kitchen Garden", status: "In Season", description: "Harvested at dawn for peak aromatic intensity. Perfect for infusing honey or delicate pastries.", intensity: "Strong" },
    { name: "Heirloom Beets", type: "Root", source: "Local Organic Farm", status: "Year Round", description: "Deep earthy undertones with a natural sweetness. Roasted for 40 minutes at 400°F.", intensity: "Mellow" },
    { name: "Aged Goat Cheese", type: "Dairy", source: "Artisanal Creamery", status: "Imported", description: "Triple cream variety with a sharp finish. Pairs exquisitely with balsamic reduction.", intensity: "High" },
    { name: "Wild Yeast Starter", type: "Ferment", source: "Nourish Kitchen", status: "Active", description: "Cultivated for 12 years. Provides the distinct tang and structure to our signature sourdough.", intensity: "Moderate" },
    { name: "Smoked Sea Salt", type: "Mineral", source: "Coastal Harvesters", status: "In Stock", description: "Infused over hickory for 24 hours. A finishing touch that adds depth and smokiness.", intensity: "Strong" },
    { name: "Madagascar Vanilla", type: "Spice", source: "Ethical Trade Co.", status: "Limited", description: "Cold-pressed extraction method. Complex flavor profile with notes of orchid and bourbon.", intensity: "Very High" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto px-4 md:px-12 py-8 md:py-10"
    >
      <header className="mb-12">
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4 flex items-center gap-4">
          The Kitchen Pantry
          <ChefHat className="text-secondary" size={32} />
        </h2>
        <p className="font-sans text-secondary text-lg">Exploring the essential ingredients behind our culinary magic.</p>
      </header>

      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="Search ingredient..." 
          className="w-full bg-white soft-shadow border border-stone-200 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-serif text-xl italic"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ingredients.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[2rem] soft-shadow border border-stone-100 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-serif text-2xl text-on-background">{item.name}</h4>
                  <span className="bg-stone-100 text-stone-500 text-[10px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                    {item.type}
                  </span>
                </div>
                <p className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Shrub size={12} /> {item.source}
                </p>
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                item.status === 'In Season' ? 'bg-emerald-100 text-emerald-800' : 
                item.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'
              }`}>
                {item.status}
              </span>
            </div>

            <p className="font-sans text-stone-500 leading-relaxed">
              {item.description}
            </p>

            <div className="pt-6 border-t border-stone-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Flavor Intensity</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 w-6 rounded-full ${
                        (item.intensity === 'Very High' && i < 5) ||
                        (item.intensity === 'Strong' && i < 4) ||
                        (item.intensity === 'Moderate' && i < 3) ||
                        (item.intensity === 'Mellow' && i < 2) ? 'bg-primary' : 'bg-stone-100'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
              <button className="p-3 text-stone-400 hover:text-primary transition-colors hover:bg-stone-50 rounded-full">
                <Info size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
