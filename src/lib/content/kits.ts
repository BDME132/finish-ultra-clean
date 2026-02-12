import { GearKit } from "@/types/content";

export const kits: GearKit[] = [
  {
    id: "first-50k",
    name: "Your First 50K Kit",
    slug: "first-50k",
    description:
      "Everything you need to finish your first 50K — and nothing you don't. We picked gear that's forgiving for beginners and proven at every distance.",
    distance: "50K",
    image: "/images/kits/first-50k.jpg",
    itemIds: [
      "hoka-speedgoat-5",
      "salomon-adv-skin-5",
      "tailwind-endurance-fuel",
      "injinji-trail-socks",
      "patagonia-strider-pro",
    ],
    totalEstimate: "$350-450",
  },
  {
    id: "budget-starter",
    name: "Budget Ultra Starter Kit",
    slug: "budget-starter",
    description:
      "Getting into ultras doesn't have to break the bank. This kit covers the essentials at the best value we could find.",
    distance: "50K",
    image: "/images/kits/budget-starter.jpg",
    itemIds: [
      "salomon-speedcross-6",
      "tailwind-endurance-fuel",
      "injinji-trail-socks",
    ],
    totalEstimate: "$180-220",
  },
  {
    id: "mountain-trail",
    name: "Mountain Trail 50-Miler Kit",
    slug: "mountain-trail",
    description:
      "Stepping up to 50 miles in the mountains? You'll need more support, more nutrition capacity, and trekking poles. This kit has you covered.",
    distance: "50M",
    image: "/images/kits/mountain-trail.jpg",
    itemIds: [
      "hoka-speedgoat-5",
      "salomon-adv-skin-5",
      "tailwind-endurance-fuel",
      "spring-energy-gels",
      "black-diamond-distance-z",
      "injinji-trail-socks",
      "patagonia-strider-pro",
    ],
    totalEstimate: "$500-650",
  },
];

export function getKitBySlug(slug: string) {
  return kits.find((k) => k.slug === slug);
}
