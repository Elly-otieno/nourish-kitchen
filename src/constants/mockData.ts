import type { Recipe, BlogPost, User, Comment, KitchenStats } from '../types.ts';

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Chef Eli', 
    email: 'eli@nourishkitchen.com', 
    role: 'ADMIN', 
    status: 'active', 
    joinedAt: '2024-01-15',
    lastSeen: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: '2', 
    name: 'Chef Sam', 
    email: 'sam@nourishkitchen.com', 
    role: 'CHEF', 
    status: 'active', 
    joinedAt: '2024-02-10',
    lastSeen: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: '3', 
    name: 'Amara', 
    email: 'amara@example.com', 
    role: 'USER', 
    status: 'active', 
    joinedAt: '2024-03-05',
    lastSeen: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200' 
  },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Swahili Pilau',
    story: `### The Soul of the Swahili Coast

There’s a specific aroma that defines the evenings in Old Town Mombasa—a heady, intoxicating mix of sea salt, woodsmoke, and the profound scent of *Pilau Masala*. It’s a scent that doesn't just promise dinner; it promises history.

Pilau is more than just a spiced rice dish. It is a living map of the Indian Ocean trade routes, a culinary bridge between the Arabian Peninsula, India, and the East African coast. Every family has their "secret" masala ratio, a legacy handed down through whispers and stained recipe scraps.

### The Secret is in the Shade
Most people think the brown color of Pilau comes from the spices. That's a common misconception. The real depth and color come from the **onions**. 

In my grandmother's kitchen, we were taught that patience is the most important ingredient. You don't just "sauté" the onions; you caramelize them until they are a deep, dark mahogany—just shy of being burnt. This is where the richness comes from. If your onions are pale, your Pilau will be pale.

### Choosing Your Rice
For a dish where every grain should stand independent and proud, the choice of rice is paramount. We always use aged Basmati. The long, slender grains absorb the beef stock and aromatic oils without becoming mushy.

When you lift the lid after the final "pika" (cooking), the steam should carry the scent of cloves and cardamom across the room. It’s a moment of pure culinary magic that connects you to generations of Swahili cooks.

### Crucial Success Tips
* **The Onion Stage:** Do not rush this. If you think the onions are dark enough, give them another 2 minutes. The color of your rice depends entirely on this.
* **Spice Quality:** Whole spices toasted and ground fresh are infinitely better than pre-ground powders. The volatile oils are what give Pilau its soul.
* **The Lid Seal:** Traditionally, we use a damp cloth around the lid to trap Every bit of steam. This is called 'pika kwa mvuke' (cooking by steam).`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '65 MINS',
    cuisine: 'East African Cuisine',
    categories: ['Heritage Recipe', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1512058560366-cd2427ba5e73?auto=format&fit=crop&q=80&w=1200',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ingredients: [
      { id: '1', name: 'whole black peppercorns', qty: '0.5', unit: 'tsp', category: 'masala' },
      { id: '2', name: 'whole cloves', qty: '0.25', unit: 'tbsp', category: 'masala' },
      { id: '3', name: 'whole cinnamon sticks', qty: '0.5', unit: 'pcs', category: 'masala' },
      { id: '4', name: 'cardamom pods', qty: '0.25', unit: 'tbsp', category: 'masala' },
      { id: '5', name: 'beef brisket, cubed', qty: '125', unit: 'g', category: 'main' },
      { id: '6', name: 'Basmati rice, rinsed', qty: '0.75', unit: 'cups', category: 'main' },
      { id: '7', name: 'large red onions, thinly sliced', qty: '0.5', unit: 'pcs', category: 'main' },
      { id: '8', name: 'cloves garlic, minced', qty: '1', unit: 'pcs', category: 'main' },
      { id: '9', name: 'fresh ginger, grated', qty: '0.5', unit: 'tbsp', category: 'main' },
    ],
    steps: [
      { id: '1', title: "Bloom the Spices", description: "Toast the whole spices until fragrant. Grind them into a fine powder." },
      { id: '2', title: "Brown the Meat", description: "Sear the cubed beef with garlic and ginger until well browned." },
      { id: '3', title: "Caramelize the Onions", description: "Fry onions until they reach a deep dark brown color." },
      { id: '4', title: "Combine and Simmer", description: "Add rice, meat, and broth. Cook on low heat until fluffy." }
    ],
    proTip: 'The secret to a deep brown Pilau is in the onions. Caramelize them slowly until they are a dark chocolate brown.',
    rating: 5.0,
    views: 1240,
    likedBy: ['3'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isPublished: true
  },
  {
    id: '13',
    title: 'Nigerian Jollof Rice',
    story: `### The Legendary Party Rice

If you haven't been to a Nigerian wedding, you haven't truly lived. And the star of every wedding—the reason aunts fight and guests linger—is the **Jollof Rice**. 

It’s not just rice. It’s an attitude. It’s a reddish, smoky, spicy celebration in a pot. The "Party Jollof" gets its signature flavor from being cooked over firewood, but we can replicate that smoky depth at home with a specific technique called "The Burn."

### The Base is Everything
The soul of Jollof is the *Tatashe* (bell pepper) and *Atarodo* (scotch bonnet) blend. We roast these with onions and tomatoes before blending to intensify the natural sugars.

### The Smoky Secret
To get that "Party" flavor on a stove, we let the rice catch slightly at the bottom of the pot. That slight charring creates a smokiness that permeates Every grain. It's a fine line between "perfectly smoky" and "burnt," but one worth walking.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '70 MINS',
    cuisine: 'West African',
    categories: ['Festive', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Long grain parboiled rice', qty: '3', unit: 'cups', category: 'main' },
      { id: '2', name: 'Red bell peppers', qty: '3', unit: 'pcs', category: 'base' },
      { id: '3', name: 'Scotch bonnet peppers', qty: '2', unit: 'pcs', category: 'base' },
      { id: '4', name: 'Plum tomatoes', qty: '5', unit: 'pcs', category: 'base' },
      { id: '5', name: 'Tomato paste', qty: '0.5', unit: 'cup', category: 'base' },
      { id: '6', name: 'Beef or Chicken stock', qty: '2', unit: 'cups', category: 'liquid' }
    ],
    steps: [
      { id: '1', title: "The Stew Base", description: "Blend peppers, tomatoes, and onions. Fry in hot oil until the water evaporates." },
      { id: '2', title: "Fry the Paste", description: "Add tomato paste and fry until it turns dark red and grainy." },
      { id: '3', title: "Seasoning", description: "Add curry powder, thyme, and bay leaves to the base." },
      { id: '4', title: "The Steam Cook", description: "Add rice and stock. Cover with foil to trap steam and cook until soft." }
    ],
    proTip: 'For the ultimate party flavor, let the rice burn slightly at the bottom of the pot before turning off the heat.',
    rating: 4.9,
    views: 4500,
    likedBy: [],
    createdAt: '2024-05-15',
    updatedAt: '2024-05-15',
    isPublished: true
  },
  {
    id: '14',
    title: 'Ethiopian Doro Wat',
    story: `### The King of Wats

Doro Wat (spicy chicken stew) is widely considered the national dish of Ethiopia. It is a labor of love, traditionally requiring hours of slow-cooking to achieve the legendary depth of flavor.

The magic comes from two things: **Nitter Kibbeh** (spiced clarified butter) and **Berbere** spice blend. But even more important is the onions. For a true Doro Wat, we use kilos of onions, chopped finely and cooked without oil for hours until they break down into a thick, sweet jam.

### Symbolic Eggs
The hard-boiled eggs added at the end are more than just food; they are a sign of a complete meal and are often given to the most respected guests at the table.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '120 MINS',
    cuisine: 'East African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Chicken drumsticks', qty: '6', unit: 'pcs', category: 'main' },
      { id: '2', name: 'Red onions', qty: '5', unit: 'large', category: 'base' },
      { id: '3', name: 'Berbere spice blend', qty: '4', unit: 'tbsp', category: 'spice' },
      { id: '4', name: 'Nitter Kibbeh', qty: '0.25', unit: 'cup', category: 'fat' },
      { id: '5', name: 'Hard-boiled eggs', qty: '4', unit: 'pcs', category: 'finish' }
    ],
    steps: [
      { id: '1', title: "The Onion Meltdown", description: "Cook onions on low heat for 45 minutes until they form a dark paste." },
      { id: '2', title: "Spice Infusion", description: "Add Kibbeh and Berbere. Cook until the oils separate from the paste." },
      { id: '3', title: "Braise the Chicken", description: "Add chicken and a splash of water. Simmer until falling off the bone." },
      { id: '4', title: "The Final Touch", description: "Add hard-boiled eggs and let them soak up the dark, spicy gravy." }
    ],
    proTip: 'Use red onions exclusively. White onions lack the sugar content needed to create the necessary caramel base.',
    rating: 5.0,
    views: 1800,
    likedBy: [],
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01',
    isPublished: true
  },
  {
    id: '15',
    title: 'Senegalese Thieboudienne',
    story: `### The Original One-Pot Wonder

Before there was Jollof, there was **Thieboudienne** (Ceebu Jen). This Senegalese masterpiece is a complex layers of fish, rice, and heritage vegetables like cassava, carrots, and eggplant, all simmered in a rich tomato base.

It’s often eaten from a communal platter, symbolizing 'Teranga'—the Senegalese spirit of hospitality. The highlight for many is the *Xooc* (pronounced 'hok'), the crispy rice at the bottom that Every diner hopes to get a piece of.`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '90 MINS',
    cuisine: 'West African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Whole white fish', qty: '1', unit: 'kg', category: 'main' },
      { id: '2', name: 'Broken jasmine rice', qty: '3', unit: 'cups', category: 'main' },
      { id: '3', name: 'Cassava', qty: '2', unit: 'pcs', category: 'veg' },
      { id: '4', name: 'Eggplant', qty: '1', unit: 'large', category: 'veg' }
    ],
    steps: [
      { id: '1', title: "Stuffing the Fish", description: "Fill the fish with a parsley and garlic herb mix." },
      { id: '2', title: "The Stew Base", description: "Fry the fish, then remove and build a heavy tomato and onion base." },
      { id: '3', title: "Simmer Veg", description: "Simmer the chunky heritage vegetables in the broth." },
      { id: '4', title: "Rice Finishing", description: "Remove veg, add rice to the remaining broth and steam until perfect." }
    ],
    proTip: 'Use broken rice if possible. It absorbs more of the fish and tomato broth, making it much more flavorful.',
    rating: 4.8,
    views: 3100,
    likedBy: [],
    createdAt: '2024-06-10',
    updatedAt: '2024-06-10',
    isPublished: true
  },
  {
    id: '16',
    title: 'Moroccan Lamb Tagine with Apricots',
    story: `### A Balance of Sweet and Savory

In the high Atlas mountains, cooking is slow. This Tagine represents the quintessential Moroccan flavor profile: tender lamb slow-cooked with warming spices and dried fruits.

The conical shape of the Tagine vessel allows for a continuous return of moisture to the dish, resulting in meat that collapses at the touch of a fork. The apricots provide a honeyed sweetness that cuts through the rich lamb fat.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '150 MINS',
    cuisine: 'North African',
    categories: ['Slow Cook', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Lamb shoulder, cubed', qty: '1', unit: 'kg', category: 'main' },
      { id: '2', name: 'Dried apricots', qty: '1', unit: 'cup', category: 'sweet' },
      { id: '3', name: 'Ras el Hanout', qty: '2', unit: 'tbsp', category: 'spice' },
      { id: '4', name: 'Saffron threads', qty: '1', unit: 'pinch', category: 'spice' }
    ],
    steps: [
      { id: '1', title: "Spice Rub", description: "Marinate lamb in Ras el Hanout and olive oil overnight." },
      { id: '2', title: "Slow Braise", description: "Put everything in the Tagine with a splash of water." },
      { id: '3', title: "Fruit Addition", description: "Add apricots in the last 30 mins to keep them from disintegrating." },
      { id: '4', title: "The Topping", description: "Finish with toasted almonds and fresh cilantro." }
    ],
    proTip: 'Do not brown the meat first. Traditionally, Tagines are started cold to preserve the delicate aromas of the spices.',
    rating: 4.9,
    views: 2800,
    likedBy: [],
    createdAt: '2024-06-20',
    updatedAt: '2024-06-20',
    isPublished: true
  },
  {
    id: '17',
    title: 'South African Bobotie',
    story: `### The Cape Malay Heritage

Bobotie (pronounced ba-bor-tee) is a sweet and savory baked mince dish that reflects the diverse history of the Western Cape. It is a culinary marriage of Dutch influence and the aromatic spice profiles of the Malay people.

It features spiced ground meat topped with a creamy egg-based custard—a texture combination that is entirely unique.`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '60 MINS',
    cuisine: 'South African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1512058560366-cd2427ba5e73?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Ground beef', qty: '500', unit: 'g', category: 'main' },
      { id: '2', name: 'Curry powder', qty: '2', unit: 'tbsp', category: 'spice' },
      { id: '3', name: 'Chutney (fruit-based)', qty: '0.25', unit: 'cup', category: 'sweet' },
      { id: '4', name: 'Eggs', qty: '2', unit: 'pcs', category: 'custard' },
      { id: '5', name: 'Milk', qty: '1', unit: 'cup', category: 'custard' }
    ],
    steps: [
      { id: '1', title: "The Mince", description: "Sauté onions, meat, and spices until browned but moist." },
      { id: '2', title: "The Sweetness", description: "Stir in the chutney, raisins, and a piece of soaked bread." },
      { id: '3', title: "The Custard", description: "Whisk milk and eggs, then pour over the meat mixture." },
      { id: '4', title: "Baking", description: "Bake until the custard is set and golden brown." }
    ],
    proTip: 'Add a few bay leaves on top of the custard before baking for an authentic Cape Malay presentation.',
    rating: 4.7,
    views: 1200,
    likedBy: [],
    createdAt: '2024-07-01',
    updatedAt: '2024-07-01',
    isPublished: true
  },
  {
    id: '18',
    title: 'Zimbabwean Sadza & Greens',
    story: `### The Daily Bread

Sadza is more than food in Zimbabwe; it is the foundation of life. This thickened cornmeal porridge is the canvas for all other flavors. When served with *Muriwo unedovi* (greens in peanut butter sauce), it creates a nutritional powerhouse that has sustained generations.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '30 MINS',
    cuisine: 'Southern African',
    categories: ['Heritage', 'Daily'],
    heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'White cornmeal', qty: '2', unit: 'cups', category: 'base' },
      { id: '2', name: 'Kale or Rape greens', qty: '1', unit: 'bunch', category: 'side' },
      { id: '3', name: 'Peanut butter', qty: '3', unit: 'tbsp', category: 'side' }
    ],
    steps: [
      { id: '1', title: "The Sadza Base", description: "Mix cornmeal with cold water, then add boiling water and stir constantly." },
      { id: '2', title: "The Thicken", description: "Add more cornmeal until the mixture is thick and heavy." },
      { id: '3', title: "The Greens", description: "Sauté greens with salt, then stir in peanut butter until creamy." },
      { id: '4', title: "Serving", description: "Serve hot, using your hands to scoop the greens with pieces of Sadza." }
    ],
    proTip: 'The secret to smooth Sadza is constant, vigorous stirring to prevent any lumps from forming.',
    rating: 4.6,
    views: 890,
    likedBy: [],
    createdAt: '2024-07-15',
    updatedAt: '2024-07-15',
    isPublished: true
  },
  {
    id: '19',
    title: 'Ghanian Kelewele',
    story: `### The Ultimate Street Snack

Walking through the streets of Accra at sunset, the air is thick with the scent of frying ginger and cloves. This is Kelewele—ripe plantains cubed, marinated in a pungent ginger spice paste, and fried until the edges are caramelized and sweet.`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '20 MINS',
    cuisine: 'West African',
    categories: ['Snack', 'Street Food'],
    heroImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Ripe plantains', qty: '3', unit: 'pcs', category: 'main' },
      { id: '2', name: 'Fresh ginger', qty: '2', unit: 'tbsp', category: 'spice' },
      { id: '3', name: 'Cloves', qty: '0.5', unit: 'tsp', category: 'spice' },
      { id: '4', name: 'Cayenne pepper', qty: '1', unit: 'tsp', category: 'spice' }
    ],
    steps: [
      { id: '1', title: "The Paste", description: "Blend ginger, cloves, salt, and pepper into a smooth paste." },
      { id: '2', title: "The Marinade", description: "Toss the cubed ripe plantains in the spice paste." },
      { id: '3', title: "The Fry", description: "Fry in hot oil until brown and caramelized on all sides." },
      { id: '4', title: "Cooling", description: "Serve immediately while hot and slightly sticky." }
    ],
    proTip: 'Use plantains that are very ripe (yellow with plenty of black spots) for the best natural sweetness.',
    rating: 4.9,
    views: 1500,
    likedBy: [],
    createdAt: '2024-08-01',
    updatedAt: '2024-08-01',
    isPublished: true
  },
  {
    id: '20',
    title: 'Nigerian Egusi Soup',
    story: `### The Nutty Heart of the South
    
Egusi soup is a staple in most Nigerian homes, especially in the South. It is made from protein-rich melon seeds (Egusi) that have been dried and ground to a powder. 

The texture is the star here—the Egusi 'clumps' together to create small, soft, nutty clusters that swim in a rich, oily broth of palm oil and leafy greens. It’s a dish that demands a heavy, pounded Yam (Iyan) to truly appreciate.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '55 MINS',
    calories: '650 kcal',
    spiceLevel: 'Hot',
    cuisine: 'West African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Ground Egusi (Melon seeds)', qty: '2', unit: 'cups', category: 'main' },
      { id: '2', name: 'Palm oil', qty: '0.5', unit: 'cup', category: 'base' },
      { id: '3', name: 'Beef and Tripe', qty: '500', unit: 'g', category: 'protein' },
      { id: '4', name: 'Fresh Spinach', qty: '2', unit: 'bunches', category: 'veg' },
      { id: '5', name: 'Ground Crayfish', qty: '2', unit: 'tbsp', category: 'seasoning' }
    ],
    steps: [
      { id: '1', title: "The Egusi Paste", description: "Mix ground Egusi with a little water to form a thick paste." },
      { id: '2', title: "Frying the Base", description: "Heat palm oil, fry onions, and then fry the Egusi paste until it forms small lumps." },
      { id: '3', title: "Stock and Simmer", description: "Add meat stock, cooked meats, and crayfish. Simmer until the oil rises to the top." },
      { id: '4', title: "The Greens", description: "Stir in chopped spinach and let it wilt for 2 minutes before serving." }
    ],
    proTip: 'For the best texture, avoid stirring the soup too much after adding the Egusi paste; this allows those signature Egusi lumps to form.',
    rating: 4.8,
    views: 1950,
    likedBy: [],
    createdAt: '2024-08-05',
    updatedAt: '2024-08-05',
    isPublished: true
  },
  {
    id: '21',
    title: 'Durban Bunny Chow',
    story: `### The Famous Indian-African Fusion
    
Originating from the Indian community in Durban, South Africa, the Bunny Chow is a hollowed-out loaf of white bread filled with spicy, rich bean or meat curry.

It’s the ultimate street food—portioned, portable, and incredibly satisfying. The bread is not just a container; it’s an integral part of the meal, soaking up the fiery gravy as you eat. Traditionally, you must start by eating the 'bread cap' that was removed to create the hollow.`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '45 MINS',
    calories: '850 kcal',
    spiceLevel: 'Extra Hot',
    cuisine: 'South African',
    categories: ['Street Food', 'Quick'],
    heroImage: 'https://images.unsplash.com/photo-1512058560366-cd2427ba5e73?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'White loaf (unsliced)', qty: '1', unit: 'pcs', category: 'base' },
      { id: '2', name: 'Sugar beans', qty: '2', unit: 'cups', category: 'main' },
      { id: '3', name: 'Durban Curry Powder', qty: '3', unit: 'tbsp', category: 'spice' },
      { id: '4', name: 'Potatoes, cubed', qty: '2', unit: 'pcs', category: 'veg' }
    ],
    steps: [
      { id: '1', title: "The Curry Base", description: "Fry onions, ginger, and garlic, then add those bold Durban spices." },
      { id: '2', title: "Slow Cook Beans", description: "Add pre-soaked beans and potatoes. Simmer until thick and the potatoes are soft." },
      { id: '3', title: "Hollow the Bread", description: "Cut a loaf into quarters and hollow out the center of each piece." },
      { id: '4', title: "Assemble", description: "Ladle the hot curry into the bread and place the bread cap on top." }
    ],
    proTip: 'Never use a fork! A true Bunny Chow is eaten with your fingers, using the bread edges to scoop the curry.',
    rating: 4.9,
    views: 2600,
    likedBy: [],
    createdAt: '2024-08-10',
    updatedAt: '2024-08-10',
    isPublished: true
  },
  {
    id: '22',
    title: 'Coconut Mandazi',
    story: `### The Sweet Mornings of the Swahili Coast
    
Mandazi are the beloved East African doughnuts. Unlike their Western counterparts, they are not overly sweet and are often infused with the warming notes of cardamom and coconut.

In coastal towns like Lamu and Malindi, these are made with fresh coconut milk squeezed that morning. They are the perfect accompaniment to a spicy cup of chai or used to scoop up savory bean stews.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '90 MINS',
    calories: '280 kcal',
    spiceLevel: 'Mild',
    cuisine: 'East African',
    categories: ['Breakfast', 'Snack'],
    heroImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'All-purpose flour', qty: '3', unit: 'cups', category: 'main' },
      { id: '2', name: 'Coconut milk', qty: '1', unit: 'cup', category: 'main' },
      { id: '3', name: 'Ground Cardamom', qty: '1', unit: 'tsp', category: 'spice' },
      { id: '4', name: 'Yeast', qty: '1', unit: 'tbsp', category: 'main' }
    ],
    steps: [
      { id: '1', title: "The Dough", description: "Mix flour, sugar, cardamom, and yeast. Add coconut milk to form a soft dough." },
      { id: '2', title: "The Proof", description: "Let the dough rest in a warm place for 1 hour until doubled in size." },
      { id: '3', title: "Cutting", description: "Roll out the dough and cut into triangles or squares." },
      { id: '4', title: "Deep Fry", description: "Fry in hot oil until golden brown and puffy." }
    ],
    proTip: 'Use fresh coconut milk if possible. The fat content is higher, resulting in a much softer and more fragrant mandazi.',
    rating: 4.7,
    views: 1400,
    likedBy: [],
    createdAt: '2024-08-15',
    updatedAt: '2024-08-15',
    isPublished: true
  },
  {
    id: '23',
    title: 'Soft Chapati & Ndengu',
    story: `### High-Protein Heritage
    
Ndengu (Mung bean stew) with Chapati is a classic Kenyan lunch that is as nutritious as it is delicious. The key is in the 'Softness' of the chapati, which requires a specific layering and oiling technique.

The beans are slow-cooked with tomatoes, onions, and often a touch of coconut or heavy spice to create a thick, earthy stew that the layered chapati can easily hold.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '60 MINS',
    calories: '420 kcal',
    spiceLevel: 'Medium',
    cuisine: 'East African',
    categories: ['Heritage', 'Lunch'],
    heroImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Dry Ndengu (Mung beans)', qty: '2', unit: 'cups', category: 'main' },
      { id: '2', name: 'Atta Flour', qty: '3', unit: 'cups', category: 'chapati' },
      { id: '3', name: 'Dhania (Cilantro)', qty: '1', unit: 'bunch', category: 'veg' },
      { id: '4', name: 'Ghee', qty: '3', unit: 'tbsp', category: 'fat' }
    ],
    steps: [
      { id: '1', title: "Boil the Beans", description: "Boil pre-soaked mung beans until tender." },
      { id: '2', title: "The Layered Chapati", description: "Roll dough, oil it, coil it like a snail, then roll out again to create layers." },
      { id: '3', title: "The Stew Base", description: "Fry onions, tomatoes, and spices, then add boiled beans and a splash of broth." },
      { id: '4', title: "Griddling", description: "Cook chapatis on a hot tawa with oil until brown spots appear." }
    ],
    proTip: 'Let your chapati dough rest for at least 30 minutes. This relaxes the gluten and makes them much softer.',
    rating: 4.8,
    views: 2200,
    likedBy: [],
    createdAt: '2024-08-20',
    updatedAt: '2024-08-20',
    isPublished: true
  },
  {
    id: '24',
    title: 'Sukuma Wiki & Ugali',
    story: `### The Fuel of the Nation
    
'Sukuma Wiki' literally translates to 'stretch the week.' It is the most ubiquitous meal in East Africa, designed to be affordable, fast, and incredibly filling. 

Collard greens are finely shredded and sautéed with onions and tomatoes until just tender, often served alongside a heavy, solid block of white cornmeal Ugali. It is the culinary heartbeat of the Kenyan household.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '25 MINS',
    calories: '350 kcal',
    spiceLevel: 'Mild',
    cuisine: 'East African',
    categories: ['Heritage', 'Daily'],
    heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Collard Greens (Sukuma)', qty: '2', unit: 'bunches', category: 'main' },
      { id: '2', name: 'White maize flour', qty: '2', unit: 'cups', category: 'base' },
      { id: '3', name: 'Beef cubes (optional)', qty: '200', unit: 'g', category: 'protein' }
    ],
    steps: [
      { id: '1', title: "The Shred", description: "Finely shred the sukuma greens into thin ribbons." },
      { id: '2', title: "The Sauté", description: "Fry onions and tomatoes, then add the greens and a pinch of salt." },
      { id: '3', title: "The Ugali", description: "Stir maize flour into boiling water until thick and solid like a cake." },
      { id: '4', title: "Steam and Set", description: "Let the ugali steam over low heat to fully cook the flour." }
    ],
    proTip: 'The secret to good sukuma wiki is not to overcook the greens. They should still have a vibrant green color and a slight bite.',
    rating: 4.5,
    views: 1100,
    likedBy: [],
    createdAt: '2024-08-25',
    updatedAt: '2024-08-25',
    isPublished: true
  },
  {
    id: '25',
    title: 'Mozambican Peri-Peri Chicken',
    story: `### The Heat of the Bird
    
Before it became a global fast-food sensation, Peri-Peri chicken was a masterpiece of Mozambican coastal cooking. It uses the Bird's Eye chili (Piri Piri), blended with garlic, lemon, and oil to create a vibrant, acidic, and fiery marinade.

Traditionally, the bird is spatchcocked (butterflied) and grilled over high wood-fire heat to ensure the marinade caramelizes into the skin while keeping the meat succulent.`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '55 MINS',
    calories: '580 kcal',
    spiceLevel: 'Hot',
    cuisine: 'Southern African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Whole chicken', qty: '1.2', unit: 'kg', category: 'main' },
      { id: '2', name: 'Bird’s Eye chilies', qty: '6', unit: 'pcs', category: 'marinade' },
      { id: '3', name: 'Lemon juice', qty: '0.25', unit: 'cup', category: 'marinade' },
      { id: '4', name: 'Garlic cloves', qty: '5', unit: 'pcs', category: 'marinade' }
    ],
    steps: [
      { id: '1', title: "The Spatchcock", description: "Remove the backbone and flatten the chicken for even grilling." },
      { id: '2', title: "The Marinade", description: "Blend chilies, garlic, lemon, and oil. Rub into the chicken and chill for 4 hours." },
      { id: '3', title: "The Sear", description: "Grill over high heat to char the skin." },
      { id: '26', title: "Slow Finish", description: "Move to a cooler part of the grill to finish cooking through." }
    ],
    proTip: 'Always save some of the marinade to brush on the chicken in the last few minutes of cooking for an extra flavor punch.',
    rating: 4.9,
    views: 3800,
    likedBy: [],
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01',
    isPublished: true
  },
  {
    id: '26',
    title: 'South African Shisa Nyama',
    story: `### The Ultimate Community BBQ
    
Shisa Nyama (literally 'burn meat') is the soul of township life in South Africa. It’s more than a meal; it’s an event. Friends gather around open fires to grill premium cuts of meat, salted simply and served with spicy chakalaka and pap.

It’s where the smoke of the wood fire meets the rhythm of local music, creating a dining experience that is about community as much as it is about cuisine.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '40 MINS',
    calories: '920 kcal',
    spiceLevel: 'Medium',
    cuisine: 'South African',
    categories: ['Heritage', 'Festive'],
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Beef Chuck or Boerewors', qty: '1', unit: 'kg', category: 'main' },
      { id: '2', name: 'Chakalaka veg mix', qty: '1', unit: 'can/batch', category: 'side' },
      { id: '3', name: 'Maize Meal (Pap)', qty: '2', unit: 'cups', category: 'side' }
    ],
    steps: [
      { id: '1', title: "The Fire", description: "Prepare a hot wood-fire or charcoal base." },
      { id: '2', title: "Meat Prep", description: "Season meats simply with sea salt and coarse black pepper." },
      { id: '3', title: "The Pap", description: "Cook stiff white porridge (pap) to a dense consistency." },
      { id: '4', title: "The Grill", description: "Sear meats over high heat until perfectly charred." }
    ],
    proTip: 'Serve with a side of spicy chakalaka—the acidity of the fermented veg cuts through the richness of the grilled meat perfectly.',
    rating: 4.8,
    views: 1700,
    likedBy: [],
    createdAt: '2024-09-10',
    updatedAt: '2024-09-10',
    isPublished: true
  },
  {
    id: '27',
    title: 'Ethiopian Shiro Wot',
    story: `### The Beloved Fasting Dish
    
Shiro Wot is perhaps the most common dish seen across Ethiopia during fasting seasons (when animal products are avoided). It is a thick, silky, and flavorful chickpea stew made from ground chickpea flour blended with berbere and garlic.

It is famously smooth and is always served on a large platter of Injera, intended to be scooped up with the tangy, fermented flatbread.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '35 MINS',
    calories: '320 kcal',
    spiceLevel: 'Medium',
    cuisine: 'East African',
    categories: ['Vegan', 'Heritage'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Shiro (ground chickpea) powder', qty: '1', unit: 'cup', category: 'main' },
      { id: '2', name: 'Red onions, minced', qty: '2', unit: 'pcs', category: 'base' },
      { id: '3', name: 'Berbere powder', qty: '2', unit: 'tbsp', category: 'spice' },
      { id: '4', name: 'Garlic, minced', qty: '1', unit: 'tbsp', category: 'base' }
    ],
    steps: [
      { id: '1', title: "Onion Sauté", description: "Cook onions without oil first to sweat them, then add oil and garlic." },
      { id: '2', title: "Spice Bloom", description: "Add berbere and cook until the oil takes on a deep red color." },
      { id: '3', title: "Whisking Shiro", description: "Whisk the shiro powder into the aromatic base slowly to avoid lumps." },
      { id: '4', title: "Simmer", description: "Simmer until the stew thickens into a slightly oily, silky consistency." }
    ],
    proTip: 'The secret is in the whisking. A perfectly smooth Shiro should have no lumps and a glossy sheen on top.',
    rating: 4.7,
    views: 2900,
    likedBy: [],
    createdAt: '2024-09-15',
    updatedAt: '2024-09-15',
    isPublished: true
  },
  {
    id: '28',
    title: 'Angolan Muamba de Galinha',
    story: `### The Nutty Braise of the Atlantic Coast
    
Muamba de Galinha (Chicken Muamba) is the national dish of Angola. It’s a rich, heavy stew where the chicken is braised in a sauce made from oil palm cream, garlic, and okra.

The result is a complex, nutty, and slightly thickened stew that represents the lush, tropical agriculture of the Angolan coast. It is traditionally served with Funge (starchy porridge made from cassava or corn).`,
    authorId: '2',
    authorName: 'Chef Sam',
    prepTime: '75 MINS',
    calories: '610 kcal',
    spiceLevel: 'Mild',
    cuisine: 'Central African',
    categories: ['Heritage', 'Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Chicken pieces', qty: '1', unit: 'kg', category: 'main' },
      { id: '2', name: 'Moamba (palm oil cream)', qty: '1', unit: 'cup', category: 'base' },
      { id: '3', name: 'Okra, sliced', qty: '10', unit: 'pcs', category: 'veg' },
      { id: '4', name: 'Pumpkin, cubed', qty: '1', unit: 'cup', category: 'veg' }
    ],
    steps: [
      { id: '1', title: "Seal the Chicken", description: "Brown the chicken in a little palm oil with garlic." },
      { id: '2', title: "Add Aromatics", description: "Add onions and squash. Sauté until the veg starts to soften." },
      { id: '3', title: "The Moamba", description: "Add the palm cream and enough water to cover. Simmer for 45 mins." },
      { id: '4', title: "Finishing", description: "Stir in okras in the last 15 mins to thicken the stew naturally." }
    ],
    proTip: 'Use red palm oil if you can’t find Moamba cream. It gives that signature vibrant orange color and nutty aroma.',
    rating: 4.8,
    views: 1300,
    likedBy: [],
    createdAt: '2024-09-20',
    updatedAt: '2024-09-20',
    isPublished: true
  },
  {
    id: '29',
    title: 'Egyptian Koshary',
    story: `### The Ultimate Carb Celebration
    
Koshary is Egypt’s national dish and most popular street food. It’s a remarkable assembly of lentils, macaroni, and rice topped with a spicy tomato sauce and garnished with chickpeas and crispy fried onions.

It sounds complex, but it’s a masterclass in texture and humble ingredients. Every spoonful is a mix of the earthy lentils, soft pasta, and the sharp bite of 'Da'ah'—the garlic vinegar sauce that brings it all together.`,
    authorId: '1',
    authorName: 'Chef Eli',
    prepTime: '60 MINS',
    calories: '750 kcal',
    spiceLevel: 'Medium',
    cuisine: 'North African',
    categories: ['Street Food', 'Vegetarian'],
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    ingredients: [
      { id: '1', name: 'Brown lentils', qty: '1', unit: 'cup', category: 'main' },
      { id: '2', name: 'White rice', qty: '1', unit: 'cup', category: 'main' },
      { id: '3', name: 'Small macaroni', qty: '1', unit: 'cup', category: 'main' },
      { id: '4', name: 'Fried Onions', qty: '2', unit: 'large', category: 'topping' }
    ],
    steps: [
      { id: '1', title: "The Grains", description: "Cook the rice, lentils, and macaroni separately until tender." },
      { id: '2', title: "Tomato Sauce", description: "Build a garlicky tomato sauce with cumin, coriander, and vinegar." },
      { id: '3', title: "The Da'ah", description: "Mix garlic, cumin, and white vinegar into a sharp dressing." },
      { id: '4', title: "Assembly", description: "Layer grains, add sauce, then garnish heavily with onions and chickpeas." }
    ],
    proTip: 'The onions are not just a garnish; they are the flavor heart of the dish. Make them very crisp and plenty!',
    rating: 4.9,
    views: 4200,
    likedBy: [],
    createdAt: '2024-09-25',
    updatedAt: '2024-09-25',
    isPublished: true
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Sourdough: Why Hydration Matters',
    excerpt: 'Exploring the delicate balance that creates the perfect crust and crumb in your heritage loaves.',
    content: `Sourdough is more than just bread; it's a living heritage of slow food. When we talk about hydration in sourdough, we're talking about the ratio of water to flour, but the craft goes much deeper.

High hydration doughs (typically 75% and above) allow for a more open crumb structure. This happens because water provides mobility for the enzymes that break down starches into sugars, which the wild yeast then consumes.

In our kitchen trials, we've found that using heritage grains often requires adjusted hydration levels due to their higher protein and fiber content. These grains are "thirsty" and can absorb significantly more water than modern highly processed flours.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200',
    date: 'Oct 24, 2024',
    readingTime: '8 min read',
    category: 'Science',
    syndicationLinks: [{ site: 'Medium', url: 'https://medium.com' }],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '2',
    title: 'Vanishing Flavors: Honoring Heirloom Spices',
    excerpt: 'A deep dive into the rare spice routes of East Africa and how we can keep these culinary traditions alive today.',
    content: `Spices are the vocabulary of flavor. Across East Africa, many unique spice varieties are disappearing as global trade prioritizes yield over complexity.

Our exploration project in Zanzibar focuses on the 'shamba' systems where cloves, nutmeg, and black pepper are grown in diverse forest-like environments. These traditional methods yield spices with aromatic profiles that are far superior to mass-produced alternatives.

By documenting these varieties and their traditional uses, we hope to create a bridge between culinary heritage and modern cooking.`,
    authorId: '1',
    authorName: 'Admin',
    heroImage: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=1200',
    date: 'Oct 20, 2024',
    readingTime: '12 min read',
    category: 'Heritage',
    syndicationLinks: [{ site: 'Substack', url: 'https://substack.com' }],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '6',
    title: 'Mugoyo vs. Jollof: The Great West African Debate',
    excerpt: 'Exploring the cultural nuances and historical roots of two of Africa’s most famous rice dishes.',
    content: `The Jollof debate is legendary, spanning borders from Lagos to Accra and beyond. However, there’s a deeper story to be told about how these dishes evolved from original Wolof traditions in Senegal.

In this piece, we explore the subtle differences in texture and spice profiles that define each nation's claim to the best Jollof. We also look at Mugoyo, a lesser-known but equally rich tradition that highlights the incredible diversity of grain cooking in the region.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1200',
    date: 'Nov 02, 2024',
    readingTime: '10 min read',
    category: 'Heritage',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '7',
    title: 'The Future of Teff: Ancient Grain, Global Superfood',
    excerpt: 'How Ethiopia’s tiny powerhouse grain is taking the world by storm and what it means for local farmers.',
    content: `Teff is the world's smallest grain, but it packs a nutritional punch that rivals any modern superfood. Traditionally used to make the fermented flatbread Injera, teff is now find its way into pasta, pastries, and porridge globally.

The challenge lies in balancing global demand with sustainable practices that preserve the genetic diversity of the grain while ensuring Ethiopian families remain the primary beneficiaries of their heritage crop.`,
    authorId: '2',
    authorName: 'Chef Sam',
    heroImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200',
    date: 'Nov 05, 2024',
    readingTime: '7 min read',
    category: 'Sustainability',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '3',
    title: 'Kitchen Flow: Designing for the Modern Cook',
    excerpt: 'Designing a workspace that respects traditional techniques while embracing modern efficiency.',
    content: `The modern home kitchen is often a site of noise and stress. Our design philosophy for a balanced kitchen involves looking back at the functional layouts of historic homesteads.

Space, light, and movement are prioritized. We use natural materials like stone and reclaimed wood to ground the cook, while integrating modern temperature control behind clean, minimal lines.

Ergonomics isn't just about height; it's about the flow of ingredients and the preservation of energy.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15224bbafb0?auto=format&fit=crop&q=80&w=1200',
    date: 'Oct 15, 2024',
    readingTime: '6 min read',
    category: 'Design',
    syndicationLinks: [{ site: 'Medium', url: 'https://medium.com' }],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '4',
    title: 'The Ceramic Table: Choosing Conscious Pottery',
    excerpt: 'Why the vessels we serve in are as important as the ingredients we cook with.',
    content: `The tactile experience of food begins with the vessel. In our studio, we exclusively use hand-thrown stoneware that reflects the earth it came from. 

There is a psychological weight to a handmade plate. It forces the diner to slow down, to acknowledge the hand of the maker, and by extension, the hand of the chef. We recommend looking for matte glazes that don’t distract from the natural colors of seasonal produce.`,
    authorId: '2',
    authorName: 'Chef Sam',
    heroImage: 'https://images.unsplash.com/photo-1457410065647-75971738f65d?auto=format&fit=crop&q=80&w=1200',
    date: 'Oct 10, 2024',
    readingTime: '5 min read',
    category: 'Journal',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '5',
    title: 'Fermentation: A Living Language',
    excerpt: 'Understanding the microbial world that creates the most complex flavors known to man.',
    content: `Every culture has a fermentation story. From the kimchi jars of Korea to the sauerkraut barrels of Germany, we are all connected by our relationship with microbes.

Fermentation is the ultimate slow cook. It is a process that requires us to surrender control and trust in the natural biological processes. In this post, we explore simple lacto-fermentation techniques that any home cook can master in a week.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1200',
    date: 'Oct 05, 2024',
    readingTime: '10 min read',
    category: 'Science',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '8',
    title: 'The Sacred Art of the Sahara Tea Ceremony',
    excerpt: 'Exploring the three cups of Ataya and the meditative pace of desert life.',
    content: `In the vast Saharan landscapes of Mauritania and Mali, time is measured not by clocks, but by the tea ceremony. The service of Ataya is a three-stage ritual that symbols the friendship and hospitality of the region.

The first cup is 'bitter like life,' the second 'sweet like love,' and the third 'gentle like death.' Each cup is painstakingly poured from a height to create a thick froth on top of the glass. 

In our busy modern lives, building a 2-hour tea ceremony into an afternoon might seem impossible, but there is a profound mental clarity that comes from the slow, rhythmic pouring and the intense, sugary mint flavor.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200',
    date: 'Nov 10, 2024',
    readingTime: '15 min read',
    category: 'Heritage',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '9',
    title: 'From Bean to Bar: The West African Cocoa Story',
    excerpt: 'Why Ghana and Ivory Coast remain the world’s chocolate heart, and the shift towards local artisanal production.',
    content: `For decades, West Africa has provided the majority of the world's cocoa, yet much of the high-end processing happened in Europe. Today, a new wave of local 'Bean to Bar' artisans are changing that narrative.

We visit local cooperatives in Ghana where farmers are becoming chocolatiers, retaining the value and the story of their craft within their communities. The flavor profile of fresh, locally processed cocoa is a revelation—bold, fruity, and untainted by long-distance shipping.`,
    authorId: '1',
    authorName: 'Chef Eli',
    heroImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200',
    date: 'Nov 12, 2024',
    readingTime: '12 min read',
    category: 'Sustainability',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  },
  {
    id: '10',
    title: 'The Salt Ponds of Djibouti: A Culinary Journey',
    excerpt: 'Extracting flavor from the alien landscapes of Lake Assal, the lowest point in Africa.',
    content: `Lake Assal in Djibouti is a wonder of the world. Surrounded by dormant volcanoes and black lava fields, the lake is so saline that salt crystals form in perfect spheres on its shores.

This isn't just common table salt. The high mineral content of Lake Assal salt gives it a unique crystalline structure and a subtle sweetness that makes it an elite finishing salt for heritage meats. 

We explored the traditional extraction methods used by the nomad caravans for centuries, a process that is as physically demanding as it is culturally significant.`,
    authorId: '2',
    authorName: 'Chef Sam',
    heroImage: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=1200',
    date: 'Nov 15, 2024',
    readingTime: '9 min read',
    category: 'Journal',
    syndicationLinks: [],
    isPublished: true,
    bookmarkedBy: []
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    entityId: '2',
    userId: '101',
    userName: 'James Miller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    content: 'The sourdough method finally clicked for me! Thank you, Queen.',
    createdAt: 'Oct 25, 2024',
    isRead: false,
    isApproved: true,
    isAnonymous: false
  },
  {
    id: '2',
    entityId: '2',
    userId: '102',
    userName: 'Elena Sophia',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    content: 'Added a pinch of cardamom as suggested, it was divine!',
    createdAt: 'Oct 24, 2024',
    isRead: true,
    isApproved: true,
    isAnonymous: false
  }
];

export const MOCK_STATS: KitchenStats = {
  totalRecipes: 18,
  totalViews: 15420,
  unreadComments: 4,
  totalComments: 12,
  totalBlogs: 10,
  totalUsers: 3,
  totalSubscribers: 245
};
