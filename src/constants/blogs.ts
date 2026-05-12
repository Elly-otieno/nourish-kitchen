
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  image: string;
  externalUrl?: string;
  externalLogo?: string;
  links: { site: string; url: string }[];
}

export const ALL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: "The Science of Sourdough: Why Hydration Matters",
    excerpt: "Exploring the chemical reactions that create the perfect crust and crumb in your legacy starters.",
    content: `
      Sourdough is more than just bread; it's a living archive of environmental biology. When we talk about hydration in sourdough, we're talking about the ratio of water to flour, but the science goes much deeper.

      High hydration doughs (typically 75% and above) allow for a more open crumb structure. This happens because water provides mobility for the enzymes that break down starches into sugars, which the wild yeast then consumes.

      In our kitchen studies, we've found that using heritage grains often requires adjusted hydration levels due to their higher protein and fiber content. These grains "thirsty" and can absorb significantly more water than modern highly processed flours.
    `,
    category: "Culinary Science",
    date: "Oct 24, 2024",
    author: "Chef Eli",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600",
    externalUrl: "https://medium.com",
    externalLogo: "Medium",
    links: [{ site: 'Medium', url: 'https://medium.com' }]
  },
  {
    id: '2',
    title: "Vanishing Flavors: Preserving Heirloom Spices",
    excerpt: "A deep dive into the rare spice routes of East Africa and how we can keep these flavors alive today.",
    content: `
      Spices are the vocabulary of flavor. Across East Africa, many unique spice varieties are disappearing as global trade prioritizes yield over complexity.

      Our retrieval project in Zanzibar focuses on the 'shamba' systems where cloves, nutmeg, and black pepper are grown in diverse forest-like environments. These traditional methods yield spices with aromatic profiles that are far superior to mass-produced alternatives.

      By documenting these varieties and their traditional uses, we hope to create a bridge between historical heritage and modern gastronomy.
    `,
    category: "Heritage",
    date: "Oct 20, 2024",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    externalUrl: "https://substack.com",
    externalLogo: "Substack",
    links: [{ site: 'Substack', url: 'https://substack.com' }]
  },
  {
    id: '3',
    title: "Kitchen Ergonomics: Building for the Next Century",
    excerpt: "Designing a workspace that respects traditional techniques while embracing modern efficiency.",
    content: `
      The modern commercial kitchen is often a site of noise and stress. Our design philosophy for the 'Kitchen of the Future' involves looking back at the functional layouts of heritage kitchens.

      Space, light, and movement are prioritized. We use natural materials like stone and reclaimed wood to ground the chef, while integrating modern temperature control and molecular tools behind clean, minimal lines.

      Ergonomics isn't just about height; it's about the flow of ingredients and the preservation of energy.
    `,
    category: "The Studio",
    date: "Oct 15, 2024",
    author: "Chef Eli",
    image: "https://images.unsplash.com/photo-1556911220-e15224bbafb0?auto=format&fit=crop&q=80&w=600",
    externalUrl: "https://medium.com",
    externalLogo: "Medium",
    links: [{ site: 'Medium', url: 'https://medium.com' }]
  }
];
