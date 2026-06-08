export const productImageMap: Record<string, string> = {
  "diamond-solitaire-ring": "/images/products/diamond-solitaire-ring.svg",
  "pearl-drop-earrings": "/images/products/pearl-drop-earrings.svg",
  "gold-tennis-bracelet": "/images/products/gold-tennis-bracelet.svg",
  "emerald-cut-ring": "/images/products/emerald-cut-ring.svg",
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