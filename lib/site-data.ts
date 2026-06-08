export type ProductType =
  | "ready-made"
  | "made-to-order"
  | "custom-quote"
  | "gemstone";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  productType: ProductType;
  price?: number;
  estimatedPriceFrom?: number;
  quoteRequired: boolean;
  metalType?: string;
  goldKarat?: string;
  goldWeight?: string;
  stoneType?: string;
  stoneWeight?: string;
  diamondCarat?: string;
  diamondCut?: string;
  diamondColor?: string;
  diamondClarity?: string;
  gemstoneCarat?: string;
  gemstoneShape?: string;
  gemstoneOrigin?: string;
  gemstoneTreatment?: string;
  certificate?: string;
  stockStatus: "In Stock" | "Made to Order" | "Request Quote";
  shortDescription: string;
  description: string;
  deliveryTime: string;
  returnEligible: boolean;
};

export const categories = [
  {
    name: "Rings",
    slug: "rings",
    href: "/shop?category=rings",
    imageText: "Diamond Rings",
  },
  {
    name: "Earrings",
    slug: "earrings",
    href: "/shop?category=earrings",
    imageText: "Pearl Earrings",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    href: "/shop?category=necklaces",
    imageText: "Gold Necklaces",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    href: "/shop?category=bracelets",
    imageText: "Luxury Bracelets",
  },
  {
    name: "Pendants",
    slug: "pendants",
    href: "/shop?category=pendants",
    imageText: "Diamond Pendants",
  },
  {
    name: "Bridal Sets",
    slug: "bridal-sets",
    href: "/shop?category=bridal-sets",
    imageText: "Bridal Jewellery",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Diamond Solitaire Ring",
    slug: "diamond-solitaire-ring",
    category: "rings",
    productType: "ready-made",
    price: 1250,
    quoteRequired: false,
    metalType: "White Gold",
    goldKarat: "18K",
    goldWeight: "4.8g",
    stoneType: "Diamond",
    stoneWeight: "0.70 ct",
    diamondCarat: "0.70 ct",
    diamondCut: "Round Brilliant",
    diamondColor: "F",
    diamondClarity: "VS1",
    certificate: "Available on request",
    stockStatus: "In Stock",
    shortDescription:
      "A timeless solitaire diamond ring crafted in 18K white gold.",
    description:
      "This elegant solitaire ring features a brilliant round cut diamond set in polished 18K white gold. A perfect choice for engagements, anniversaries, and special occasions.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "2",
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    category: "earrings",
    productType: "ready-made",
    price: 980,
    quoteRequired: false,
    metalType: "Yellow Gold",
    goldKarat: "18K",
    goldWeight: "5.2g",
    stoneType: "Pearl",
    stoneWeight: "Natural pearl pair",
    certificate: "Jewellery authenticity card",
    stockStatus: "In Stock",
    shortDescription: "Elegant pearl drop earrings for luxury everyday wear.",
    description:
      "Classic pearl drop earrings crafted in 18K yellow gold. Designed for elegant occasions and premium everyday styling.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "3",
    name: "Gold Tennis Bracelet",
    slug: "gold-tennis-bracelet",
    category: "bracelets",
    productType: "ready-made",
    price: 2350,
    quoteRequired: false,
    metalType: "Yellow Gold",
    goldKarat: "18K",
    goldWeight: "14.5g",
    stoneType: "Diamond",
    stoneWeight: "1.20 ct total",
    diamondCarat: "1.20 ct total",
    diamondCut: "Round",
    diamondColor: "G-H",
    diamondClarity: "VS-SI",
    certificate: "Available on request",
    stockStatus: "In Stock",
    shortDescription: "Premium tennis bracelet with refined gold finishing.",
    description:
      "A luxury tennis bracelet featuring refined stone setting and premium gold finishing. Suitable for formal and luxury gifting occasions.",
    deliveryTime: "10-18 business days",
    returnEligible: true,
  },
  {
    id: "4",
    name: "Emerald Cut Ring",
    slug: "emerald-cut-ring",
    category: "rings",
    productType: "ready-made",
    price: 1890,
    quoteRequired: false,
    metalType: "White Gold",
    goldKarat: "18K",
    goldWeight: "5.1g",
    stoneType: "Emerald",
    stoneWeight: "1.20 ct",
    certificate: "Gemstone certificate available",
    stockStatus: "In Stock",
    shortDescription:
      "A refined emerald cut ring with certified gemstone setting.",
    description:
      "A premium emerald ring designed with a clean luxury setting. Ideal for gemstone lovers and meaningful gifts.",
    deliveryTime: "10-18 business days",
    returnEligible: true,
  },
  {
    id: "5",
    name: "Diamond Pendant",
    slug: "diamond-pendant",
    category: "pendants",
    productType: "ready-made",
    price: 1120,
    quoteRequired: false,
    metalType: "Yellow Gold",
    goldKarat: "18K",
    goldWeight: "3.2g",
    stoneType: "Diamond",
    stoneWeight: "0.35 ct",
    diamondCarat: "0.35 ct",
    diamondCut: "Round",
    diamondColor: "G",
    diamondClarity: "VS2",
    certificate: "Available on request",
    stockStatus: "In Stock",
    shortDescription:
      "Minimal diamond pendant with a premium fine jewellery finish.",
    description:
      "A minimal yet luxurious diamond pendant crafted for elegant daily wear and special gifting.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "6",
    name: "Ruby Halo Ring",
    slug: "ruby-halo-ring",
    category: "rings",
    productType: "ready-made",
    price: 2450,
    quoteRequired: false,
    metalType: "Rose Gold",
    goldKarat: "18K",
    goldWeight: "5.8g",
    stoneType: "Ruby",
    stoneWeight: "1.10 ct",
    certificate: "Gemstone certificate available",
    stockStatus: "In Stock",
    shortDescription: "A bold ruby halo ring designed for special occasions.",
    description:
      "A statement ruby halo ring crafted in 18K rose gold with a luxury gemstone setting.",
    deliveryTime: "10-18 business days",
    returnEligible: true,
  },
  {
    id: "7",
    name: "Custom Name Pendant",
    slug: "custom-name-pendant",
    category: "pendants",
    productType: "custom-quote",
    estimatedPriceFrom: 350,
    quoteRequired: true,
    metalType: "Yellow Gold",
    goldKarat: "18K",
    stoneType: "Optional",
    certificate: "Jewellery authenticity card",
    stockStatus: "Request Quote",
    shortDescription:
      "Personalized name pendant made according to your chosen design.",
    description:
      "Create a personalized name pendant in your preferred gold karat, size, font style, and optional stone setting. Final price depends on gold weight and customization.",
    deliveryTime: "2-4 weeks after deposit",
    returnEligible: false,
  },
  {
    id: "8",
    name: "Custom Engagement Ring",
    slug: "custom-engagement-ring",
    category: "rings",
    productType: "custom-quote",
    estimatedPriceFrom: 900,
    quoteRequired: true,
    metalType: "White Gold",
    goldKarat: "18K",
    stoneType: "Diamond",
    certificate: "Diamond certificate available",
    stockStatus: "Request Quote",
    shortDescription:
      "Custom engagement ring designed with your diamond and budget.",
    description:
      "Design a custom engagement ring by choosing metal, gold karat, diamond shape, diamond quality, and budget. Final quote is confirmed after stone selection.",
    deliveryTime: "3-6 weeks after deposit",
    returnEligible: false,
  },
  {
    id: "9",
    name: "Bridal Jewellery Set",
    slug: "bridal-jewellery-set",
    category: "bridal-sets",
    productType: "made-to-order",
    estimatedPriceFrom: 1800,
    quoteRequired: true,
    metalType: "Yellow Gold",
    goldKarat: "22K",
    stoneType: "Custom",
    certificate: "Jewellery authenticity card",
    stockStatus: "Made to Order",
    shortDescription:
      "Luxury bridal set made to order with gold and gemstone options.",
    description:
      "A luxury bridal jewellery set made according to your design, gold weight, and gemstone preference. Final price depends on current market rates.",
    deliveryTime: "4-8 weeks after deposit",
    returnEligible: false,
  },
  {
    id: "10",
    name: "Sapphire Bracelet",
    slug: "sapphire-bracelet",
    category: "bracelets",
    productType: "made-to-order",
    estimatedPriceFrom: 760,
    quoteRequired: true,
    metalType: "White Gold",
    goldKarat: "18K",
    stoneType: "Sapphire",
    certificate: "Gemstone certificate available",
    stockStatus: "Made to Order",
    shortDescription:
      "Elegant sapphire bracelet made after gemstone confirmation.",
    description:
      "A sapphire bracelet made to order using your preferred gemstone size, metal type, and budget.",
    deliveryTime: "3-5 weeks after deposit",
    returnEligible: false,
  },
  {
    id: "11",
    name: "Round Brilliant Diamond",
    slug: "round-brilliant-diamond",
    category: "gemstones",
    productType: "gemstone",
    price: 620,
    quoteRequired: false,
    stoneType: "Diamond",
    gemstoneCarat: "0.50 ct",
    gemstoneShape: "Round Brilliant",
    diamondColor: "G",
    diamondClarity: "VS2",
    certificate: "Certificate available",
    stockStatus: "In Stock",
    shortDescription:
      "Certified round brilliant diamond suitable for rings and pendants.",
    description:
      "A round brilliant diamond selected for custom jewellery, engagement rings, pendants, and luxury settings. Certification details are available on request.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "12",
    name: "Oval Ruby Gemstone",
    slug: "oval-ruby-gemstone",
    category: "gemstones",
    productType: "gemstone",
    price: 410,
    quoteRequired: false,
    stoneType: "Ruby",
    gemstoneCarat: "1.25 ct",
    gemstoneShape: "Oval",
    gemstoneOrigin: "Mozambique",
    gemstoneTreatment: "Heated",
    certificate: "Gemstone certificate available",
    stockStatus: "In Stock",
    shortDescription:
      "Rich red oval ruby for rings, pendants, and custom jewellery.",
    description:
      "A beautiful oval ruby with strong color presence. Ideal for custom rings, pendants, and statement jewellery designs.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "13",
    name: "Emerald Cut Emerald",
    slug: "emerald-cut-emerald",
    category: "gemstones",
    productType: "gemstone",
    price: 700,
    quoteRequired: false,
    stoneType: "Emerald",
    gemstoneCarat: "2.10 ct",
    gemstoneShape: "Emerald Cut",
    gemstoneOrigin: "Zambia",
    gemstoneTreatment: "Minor oil",
    certificate: "Gemstone certificate available",
    stockStatus: "In Stock",
    shortDescription:
      "Premium emerald cut emerald with luxury green tone.",
    description:
      "A refined emerald cut emerald suitable for high-end rings, pendants, and bespoke jewellery pieces.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "14",
    name: "Blue Sapphire Oval Stone",
    slug: "blue-sapphire-oval-stone",
    category: "gemstones",
    productType: "gemstone",
    price: 630,
    quoteRequired: false,
    stoneType: "Sapphire",
    gemstoneCarat: "1.40 ct",
    gemstoneShape: "Oval",
    gemstoneOrigin: "Sri Lanka",
    gemstoneTreatment: "Heated",
    certificate: "Gemstone certificate available",
    stockStatus: "In Stock",
    shortDescription:
      "Elegant blue sapphire for rings, bracelets, and custom designs.",
    description:
      "A blue sapphire with elegant tone, ideal for custom ring and bracelet designs.",
    deliveryTime: "7-14 business days",
    returnEligible: true,
  },
  {
    id: "15",
    name: "Opal Cabochon Stone",
    slug: "opal-cabochon-stone",
    category: "gemstones",
    productType: "gemstone",
    estimatedPriceFrom: 250,
    quoteRequired: true,
    stoneType: "Opal",
    gemstoneCarat: "Custom selection",
    gemstoneShape: "Cabochon",
    certificate: "Available on request",
    stockStatus: "Request Quote",
    shortDescription:
      "Opal stones available on request for custom jewellery projects.",
    description:
      "Opal stones are sourced according to customer preference, size, color play, and budget. Final price is confirmed after availability check.",
    deliveryTime: "2-4 weeks after confirmation",
    returnEligible: false,
  },
];

export const gemstoneProducts = products.filter(
  (product) => product.productType === "gemstone"
);

export const featuredProducts = products
  .filter((product) => product.productType !== "gemstone")
  .slice(0, 4);

export const gemstones = [
  { name: "All", slug: "all", href: "/gemstones" },
  { name: "Diamond", slug: "diamond", href: "/gemstones?stone=Diamond" },
  { name: "Ruby", slug: "ruby", href: "/gemstones?stone=Ruby" },
  { name: "Emerald", slug: "emerald", href: "/gemstones?stone=Emerald" },
  { name: "Sapphire", slug: "sapphire", href: "/gemstones?stone=Sapphire" },
  { name: "Opal", slug: "opal", href: "/gemstones?stone=Opal" },
];

export const trustPoints = [
  "Certified Gemstones",
  "Real Gold Purity",
  "Secure Payments",
  "Worldwide Shipping",
  "Insured Delivery",
  "Expert Craftsmanship",
];

export const reviews = [
  {
    name: "Ayesha K.",
    country: "UAE",
    review:
      "The custom ring was beautifully made and the quotation process was very clear.",
  },
  {
    name: "Sarah M.",
    country: "United Kingdom",
    review:
      "Premium packaging, certified stone, and smooth worldwide delivery.",
  },
  {
    name: "Daniel R.",
    country: "USA",
    review:
      "I ordered a custom pendant and the final piece looked better than expected.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(currentSlug: string, category: string) {
  return products
    .filter(
      (product) =>
        product.slug !== currentSlug && product.category === category
    )
    .slice(0, 3);
}