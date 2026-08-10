// Category-specific marketing copy that isn't modeled in the database — per
// STRUCTURE.md §4's admin-editable map, "why choose" bullets / "ideal for"
// tags / guarantee lines aren't listed as admin-editable content, so they
// live here rather than as DB fields. Keyed by Category.slug (see seed.py).

export interface CategoryContent {
  heroHeadline: string;
  whyChoose: string[];
  guarantee: string;
  idealFor: string[];
  swatchClass: string;
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "leather-goods": {
    heroHeadline: "Leather That Gets Better With Age",
    whyChoose: [
      "Each piece passes through the hands of the same Dharavi artisans — you can feel the difference between handmade and mass-produced",
      "Full-grain leather develops a richer patina the more you use it, not less",
      "Reinforced stitching and solid brass hardware, built to handle daily use for years",
      "A thoughtful gift for someone who values things that last, not things that are trendy",
    ],
    guarantee: "Every piece is inspected by hand before it's packed — so what you see is exactly what arrives.",
    idealFor: ["Everyday Carry", "Thoughtful Gifting", "Considered Basics", "Built to Last"],
    swatchClass: "sw-leather",
  },
  copperware: {
    heroHeadline: "Copperware Made to Earn a Place on Your Table",
    whyChoose: [
      "Food-grade 99.9% copper — safe for daily food and beverage use, not just display",
      "Hand-hammered using techniques passed down through generations",
      "Develops a natural patina with use — no two pieces age quite the same",
      "A gift that becomes part of someone's daily ritual, not a drawer decoration",
    ],
    guarantee: "Every piece is food-safety checked and hand-inspected before it's packed.",
    idealFor: ["Kitchen Rituals", "Wellness", "Home Décor", "Thoughtful Gifting"],
    swatchClass: "sw-copper",
  },
  jewellery: {
    heroHeadline: "Jewellery With Real Craft Behind It",
    whyChoose: [
      "Designed and finished by Jaipur's jewellery artisans, using generations-old technique",
      "Hypoallergenic plating, so you can wear it daily without a second thought",
      "Traditional craft, reworked for how people actually dress today",
      "Complete sets mean you're never left hunting for a matching piece",
    ],
    guarantee: "Every piece is quality-checked by hand before it ships — plating, stones, and finish included.",
    idealFor: ["Everyday Wear", "Special Occasions", "Thoughtful Gifting", "Statement Pieces"],
    swatchClass: "sw-jewel",
  },
  "handcrafted-home-decor": {
    heroHeadline: "Home Decor With a Maker Behind Every Piece",
    whyChoose: [
      "Wood, clay and textile craft, each from artisans who specialise in exactly that material",
      "Natural variation is part of the piece — no two are identical, and that's the point",
      "Preserves techniques that are disappearing from mass production",
      "Pieces that make a house feel like it belongs to you",
    ],
    guarantee: "Every piece is inspected by hand for finish and quality before it's packed.",
    idealFor: ["Home Styling", "Thoughtful Gifting", "Statement Pieces", "Everyday Living"],
    swatchClass: "sw-craft",
  },
  "sustainable-lifestyle-products": {
    heroHeadline: "Everyday Swaps That Actually Hold Up",
    whyChoose: [
      "Biodegradable and natural materials across the entire line, not just the marketing copy",
      "Plastic-reduced, recyclable packaging as standard",
      "Built for daily use, so 'sustainable' doesn't mean 'disposable'",
      "Small, easy swaps that add up over time",
    ],
    guarantee: "Every material and packaging choice is checked against our own plastic-free standard before it ships.",
    idealFor: ["Considered Living", "Everyday Swaps", "Thoughtful Gifting", "Zero-Waste Kitchen"],
    swatchClass: "sw-sustain",
  },
  "curated-indian-essentials": {
    heroHeadline: "India's Pantry, Curated for Your Kitchen",
    whyChoose: [
      "Sourced from small farms and mills, not commodity trading floors",
      "Traceable back to the region it was grown or made in",
      "Packaged in small batches for freshness, not shelf-life extenders",
      "A pantry gift that introduces someone to real Indian ingredients",
    ],
    guarantee: "Every batch is quality-checked before it's packed — freshness first.",
    idealFor: ["Pantry Staples", "Thoughtful Gifting", "Home Cooking", "Tea Lovers"],
    swatchClass: "sw-agri",
  },
};

export function getCategoryContent(slug: string): CategoryContent {
  return (
    CATEGORY_CONTENT[slug] ?? {
      heroHeadline: "Made By Hand",
      whyChoose: [
        "Sourced from named artisan communities across India",
        "Every piece inspected by hand before it ships",
        "Small-batch, not mass-produced",
      ],
      guarantee: "Every piece is inspected by hand before it's packed.",
      idealFor: ["Thoughtful Gifting", "Everyday Living"],
      swatchClass: "sw-craft",
    }
  );
}
