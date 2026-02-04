export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  distance: string;
}

export const products: Product[] = [
  {
    id: "50k-finish-kit",
    name: "50K Finish Kit",
    description:
      "Entry-level ultra kit with essential nutrition and recovery items for your first ultra.",
    price: 45,
    image: "/images/50k-kit.jpg",
    distance: "50K",
  },
  {
    id: "100k-finish-kit",
    name: "100K Finish Kit",
    description:
      "Mid-distance kit with expanded nutrition options and premium recovery essentials.",
    price: 75,
    image: "/images/100k-kit.jpg",
    distance: "100K",
  },
  {
    id: "100-mile-finish-kit",
    name: "100 Mile Finish Kit",
    description:
      "The complete ultra kit. Everything you need to fuel and recover from the ultimate distance.",
    price: 120,
    image: "/images/100-mile-kit.jpg",
    distance: "100 Mile",
  },
];
