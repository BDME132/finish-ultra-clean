import { AffiliateProduct } from "@/types/content";

export const products: AffiliateProduct[] = [
  {
    id: "salomon-adv-skin-5",
    name: "ADV Skin 5 Set",
    brand: "Salomon",
    category: "packs",
    description:
      "The most popular entry-level running vest. Fits most body types, great pocket layout, and carries everything you need for a 50K.",
    image: "/images/gear/salomon-adv-skin.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "This is the vest we see on more first-time ultrarunners than any other. It just works.",
    tags: ["beginner", "50k", "best-seller"],
  },
  {
    id: "hoka-speedgoat-5",
    name: "Speedgoat 5",
    brand: "Hoka",
    category: "shoes",
    description:
      "Max-cushion trail shoe with aggressive grip. Protective enough for rocky terrain but comfortable for long road sections.",
    image: "/images/gear/hoka-speedgoat.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "If you only buy one pair of trail shoes, make it these. Forgiving on tired legs and grippy on everything.",
    tags: ["beginner", "trail", "cushioned"],
  },
  {
    id: "salomon-speedcross-6",
    name: "Speedcross 6",
    brand: "Salomon",
    category: "shoes",
    description:
      "Aggressive mud shoe with deep lugs. Best for soft, wet, or technical terrain where grip is everything.",
    image: "/images/gear/salomon-speedcross.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "The go-to when conditions are muddy or loose. Not an everyday shoe, but unbeatable in its element.",
    tags: ["mud", "technical", "grip"],
  },
  {
    id: "tailwind-endurance-fuel",
    name: "Endurance Fuel",
    brand: "Tailwind",
    category: "nutrition",
    description:
      "All-in-one calories and electrolytes. Mix with water and sip steadily — no gels, no stomach issues.",
    image: "/images/gear/tailwind.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "The simplest nutrition strategy for beginners. One product replaces gels, chews, and electrolyte tabs.",
    tags: ["beginner", "nutrition", "simple"],
  },
  {
    id: "spring-energy-gels",
    name: "Awesome Sauce Gel",
    brand: "Spring Energy",
    category: "nutrition",
    description:
      "Real-food gel made with rice and fruit. Easy on the stomach and tastes like actual food, not chemicals.",
    image: "/images/gear/spring-energy.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "If you hate the taste of traditional gels, these are a game-changer. Real ingredients you can pronounce.",
    tags: ["real-food", "gels", "stomach-friendly"],
  },
  {
    id: "patagonia-strider-pro",
    name: 'Strider Pro 5" Shorts',
    brand: "Patagonia",
    category: "apparel",
    description:
      "Lightweight running shorts with built-in brief. Quick-drying fabric that handles sweat and rain without chafing.",
    image: "/images/gear/patagonia-strider.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "Comfortable for 5 miles or 50. The built-in liner means one less thing to worry about on race day.",
    tags: ["apparel", "shorts", "anti-chafe"],
  },
  {
    id: "injinji-trail-socks",
    name: "Trail Midweight Crew",
    brand: "Injinji",
    category: "apparel",
    description:
      "Toe socks designed for trail running. The individual toe pockets prevent blisters between toes — the #1 blister spot in ultras.",
    image: "/images/gear/injinji-socks.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "Blisters end more ultras than fitness does. These socks are the single best blister prevention we know.",
    tags: ["socks", "blister-prevention", "beginner"],
  },
  {
    id: "black-diamond-distance-z",
    name: "Distance Z Trekking Poles",
    brand: "Black Diamond",
    category: "packs",
    description:
      "Ultralight folding trekking poles. Collapse small enough to stash on your vest when you don't need them.",
    image: "/images/gear/bd-poles.jpg",
    affiliateUrl: "#",
    whyWeRecommend:
      "For any race with significant climbing, poles save your legs. These fold down small and weigh almost nothing.",
    tags: ["poles", "climbing", "mountain"],
  },
];

export function getProductsByCategory(category: AffiliateProduct["category"]) {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
