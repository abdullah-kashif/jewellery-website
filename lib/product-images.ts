export const productImageMap: Record<string, string> = {
  "diamond-solitaire-ring":
    "/images/home/product-diamond-solitaire-ring.jpg",
  "pearl-drop-earrings": "/images/home/product-pearl-drop-earrings.jpg",
  "gold-tennis-bracelet":
    "/images/home/product-gold-tennis-bracelet.jpg",
  "emerald-cut-ring": "/images/home/product-emerald-cut-ring.jpg",
  "diamond-pendant": "/images/products/diamond-pendant.svg",
  "ruby-halo-ring": "/images/products/ruby-halo-ring.svg",
  "custom-name-pendant": "/images/products/custom-name-pendant.svg",
  "custom-engagement-ring": "/images/products/custom-engagement-ring.svg",
  "bridal-jewellery-set": "/images/products/bridal-jewellery-set.svg",
  "sapphire-bracelet": "/images/products/sapphire-bracelet.svg",

  "round-brilliant-diamond": "/images/gemstones/round-brilliant-diamond.svg",
  "oval-ruby-gemstone": "/images/gemstones/oval-ruby-gemstone.svg",
  "emerald-cut-emerald": "/images/gemstones/emerald-cut-emerald.svg",
  "blue-sapphire-oval-stone": "/images/gemstones/blue-sapphire-oval-stone.svg",
  "opal-cabochon-stone": "/images/gemstones/opal-cabochon-stone.svg",
};

export function getProductImage(slug: string) {
  return productImageMap[slug] || "/images/products/diamond-solitaire-ring.svg";
}

export function getKnownProductImage(slug: string) {
  return productImageMap[slug] || null;
}
