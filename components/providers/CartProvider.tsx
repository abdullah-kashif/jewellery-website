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

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  productType: ProductType;
  price?: number;
  estimatedPriceFrom?: number;
  quoteRequired: boolean;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (slug: string) => boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "luxora-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch {
      setCartItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isReady]);

  function addToCart(product: Product) {
    if (product.quoteRequired || product.productType === "custom-quote") {
      return false;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.slug === product.slug
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        productType: product.productType,
        price: product.price,
        estimatedPriceFrom: product.estimatedPriceFrom,
        quoteRequired: product.quoteRequired,
        quantity: 1,
      };

      return [...currentItems, newItem];
    });

    return true;
  }

  function removeFromCart(slug: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.slug !== slug)
    );
  }

  function updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || item.estimatedPriceFrom || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  }

  function getCartCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function isInCart(slug: string) {
    return cartItems.some((item) => item.slug === slug);
  }

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isInCart,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}