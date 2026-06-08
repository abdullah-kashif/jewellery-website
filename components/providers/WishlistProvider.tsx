"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product, ProductType } from "@/lib/site-data";

export type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  productType: ProductType;
  price?: number;
  estimatedPriceFrom?: number;
  quoteRequired: boolean;
  stockStatus: string;
};

type WishlistContextValue = {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (slug: string) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (slug: string) => boolean;
  getWishlistCount: () => number;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "luxora-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = window.localStorage.getItem(STORAGE_KEY);

      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch {
      setWishlistItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems, isReady]);

  function addToWishlist(product: Product) {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some((item) => item.slug === product.slug);

      if (exists) {
        return currentItems;
      }

      const newItem: WishlistItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        productType: product.productType,
        price: product.price,
        estimatedPriceFrom: product.estimatedPriceFrom,
        quoteRequired: product.quoteRequired,
        stockStatus: product.stockStatus,
      };

      return [...currentItems, newItem];
    });
  }

  function removeFromWishlist(slug: string) {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.slug !== slug)
    );
  }

  function toggleWishlist(product: Product) {
    const exists = wishlistItems.some((item) => item.slug === product.slug);

    if (exists) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  }

  function clearWishlist() {
    setWishlistItems([]);
  }

  function isInWishlist(slug: string) {
    return wishlistItems.some((item) => item.slug === slug);
  }

  function getWishlistCount() {
    return wishlistItems.length;
  }

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isInWishlist,
      getWishlistCount,
    }),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}