"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  product_type: string;
  price: number | null;
  estimated_price_from: number | null;
  image_url: string | null;
  quote_required: boolean;
  metal_type: string | null;
  gold_karat: string | null;
  gold_weight: string | null;
  stone_type: string | null;
  stone_weight: string | null;
  diamond_carat: string | null;
  diamond_cut: string | null;
  diamond_color: string | null;
  diamond_clarity: string | null;
  gemstone_carat: string | null;
  gemstone_shape: string | null;
  gemstone_origin: string | null;
  gemstone_treatment: string | null;
  certificate: string | null;
  stock_status: string;
  short_description: string;
  description: string;
  delivery_time: string;
  return_eligible: boolean;
  created_at: string;
  updated_at: string | null;
};

type ProductForm = {
  name: string;
  slug: string;
  category: string;
  productType: string;
  price: string;
  estimatedPriceFrom: string;
  imageUrl: string;
  quoteRequired: boolean;
  metalType: string;
  goldKarat: string;
  goldWeight: string;
  stoneType: string;
  stoneWeight: string;
  diamondCarat: string;
  diamondCut: string;
  diamondColor: string;
  diamondClarity: string;
  gemstoneCarat: string;
  gemstoneShape: string;
  gemstoneOrigin: string;
  gemstoneTreatment: string;
  certificate: string;
  stockStatus: string;
  shortDescription: string;
  description: string;
  deliveryTime: string;
  returnEligible: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  category: "rings",
  productType: "ready-made",
  price: "",
  estimatedPriceFrom: "",
  imageUrl: "",
  quoteRequired: false,
  metalType: "",
  goldKarat: "",
  goldWeight: "",
  stoneType: "",
  stoneWeight: "",
  diamondCarat: "",
  diamondCut: "",
  diamondColor: "",
  diamondClarity: "",
  gemstoneCarat: "",
  gemstoneShape: "",
  gemstoneOrigin: "",
  gemstoneTreatment: "",
  certificate: "",
  stockStatus: "In Stock",
  shortDescription: "",
  description: "",
  deliveryTime: "7 to 18 business days",
  returnEligible: true,
};

const productTypes = [
  { label: "Ready Made", value: "ready-made" },
  { label: "Made To Order", value: "made-to-order" },
  { label: "Custom Quote", value: "custom-quote" },
  { label: "Gemstone", value: "gemstone" },
];

const stockStatuses = [
  "In Stock",
  "Made To Order",
  "Request Quote",
  "Out Of Stock",
];

const categories = [
  "rings",
  "earrings",
  "bracelets",
  "pendants",
  "necklaces",
  "custom-jewellery",
  "gemstones",
];

const inputClass =
  "w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a77a25]";

const labelClass =
  "mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(price: number | null) {
  if (!price) {
    return "Quote";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function prettyText(value: string) {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mapProductToForm(product: SupabaseProduct): ProductForm {
  return {
    name: product.name || "",
    slug: product.slug || "",
    category: product.category || "rings",
    productType: product.product_type || "ready-made",
    price: product.price ? String(product.price) : "",
    estimatedPriceFrom: product.estimated_price_from
      ? String(product.estimated_price_from)
      : "",
    imageUrl: product.image_url || "",
    quoteRequired: Boolean(product.quote_required),
    metalType: product.metal_type || "",
    goldKarat: product.gold_karat || "",
    goldWeight: product.gold_weight || "",
    stoneType: product.stone_type || "",
    stoneWeight: product.stone_weight || "",
    diamondCarat: product.diamond_carat || "",
    diamondCut: product.diamond_cut || "",
    diamondColor: product.diamond_color || "",
    diamondClarity: product.diamond_clarity || "",
    gemstoneCarat: product.gemstone_carat || "",
    gemstoneShape: product.gemstone_shape || "",
    gemstoneOrigin: product.gemstone_origin || "",
    gemstoneTreatment: product.gemstone_treatment || "",
    certificate: product.certificate || "",
    stockStatus: product.stock_status || "In Stock",
    shortDescription: product.short_description || "",
    description: product.description || "",
    deliveryTime: product.delivery_time || "7 to 18 business days",
    returnEligible: Boolean(product.return_eligible),
  };
}

export function AdminProductsClient() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load products.");
      }

      setProducts(result.products || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetImage() {
    setImageFile(null);
    setImagePreviewUrl("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
    resetImage();
    setError("");
    setSuccess("");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!selectedFile) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG, WEBP, and GIF images are allowed.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Image size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    setImageFile(selectedFile);
    setImagePreviewUrl(URL.createObjectURL(selectedFile));
  }

  function removeSelectedImage() {
    setImageFile(null);
    setImagePreviewUrl("");
    updateField("imageUrl", "");
  }

  async function uploadProductImage(slug: string) {
    if (!imageFile) {
      return form.imageUrl.trim();
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);
    uploadFormData.append("slug", slug);

    const response = await fetch("/api/admin/product-images", {
      method: "POST",
      body: uploadFormData,
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Failed to upload product image.");
    }

    return String(result.url || "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const finalSlug = form.slug || makeSlug(form.name);

    try {
      const finalImageUrl = await uploadProductImage(finalSlug);

      const payload = {
        ...form,
        slug: finalSlug,
        imageUrl: finalImageUrl,
      };

      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to save product.");
      }

      if (editingId) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingId ? result.product : product
          )
        );
        setSuccess("Product updated successfully.");
      } else {
        setProducts((currentProducts) => [result.product, ...currentProducts]);
        setSuccess("Product added successfully.");
      }

      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(product: SupabaseProduct) {
    setEditingId(product.id);
    setForm(mapProductToForm(product));
    setImageFile(null);
    setImagePreviewUrl(product.image_url || "");
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoadingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to delete product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Product deleted successfully.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete product."
      );
    } finally {
      setActionLoadingId("");
    }
  }

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.product_type.toLowerCase().includes(keyword) ||
        product.stock_status.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  const previewImage = imagePreviewUrl || form.imageUrl;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
              {editingId ? "Edit Product" : "Add Product"}
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
              {editingId ? "Update Product Details" : "Create New Product"}
            </h2>

            <p className="mt-2 text-sm text-neutral-600">
              Add product details, pricing, jewellery specifications, and image.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[#d6b46a] px-5 py-3 text-sm font-semibold text-[#a77a25] hover:bg-[#d6b46a] hover:text-neutral-950"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-5">
              <label className={labelClass}>Product Image</label>

              <div className="overflow-hidden rounded-3xl border border-[#eadfca] bg-white">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Product preview"
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-[#f5efe4] text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#a77a25]">
                        ◆
                      </div>
                      <p className="mt-4 text-sm font-semibold text-neutral-700">
                        No image selected
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        JPG, PNG, WEBP, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="mt-4 w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm"
              />

              <div className="mt-4 grid gap-3">
                <input
                  value={form.imageUrl}
                  onChange={(event) => updateField("imageUrl", event.target.value)}
                  placeholder="Or paste image URL manually"
                  className={inputClass}
                />

                {(previewImage || form.imageUrl) && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Example: Diamond Solitaire Ring"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug *</label>
                <div className="flex gap-3">
                  <input
                    required
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    placeholder="diamond-solitaire-ring"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => updateField("slug", makeSlug(form.name))}
                    className="rounded-2xl bg-neutral-950 px-4 text-xs font-semibold text-white hover:bg-[#a77a25]"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {prettyText(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Product Type *</label>
                <select
                  required
                  value={form.productType}
                  onChange={(event) =>
                    updateField("productType", event.target.value)
                  }
                  className={inputClass}
                >
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Fixed Price USD</label>
                <input
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  type="number"
                  min="0"
                  placeholder="2400"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estimated Price From USD</label>
                <input
                  value={form.estimatedPriceFrom}
                  onChange={(event) =>
                    updateField("estimatedPriceFrom", event.target.value)
                  }
                  type="number"
                  min="0"
                  placeholder="1200"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Stock Status *</label>
                <select
                  required
                  value={form.stockStatus}
                  onChange={(event) =>
                    updateField("stockStatus", event.target.value)
                  }
                  className={inputClass}
                >
                  {stockStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Delivery Time *</label>
                <input
                  required
                  value={form.deliveryTime}
                  onChange={(event) =>
                    updateField("deliveryTime", event.target.value)
                  }
                  placeholder="7 to 18 business days"
                  className={inputClass}
                />
              </div>

              <div className="rounded-3xl bg-[#fbf7ef] p-5">
                <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={form.quoteRequired}
                    onChange={(event) =>
                      updateField("quoteRequired", event.target.checked)
                    }
                  />
                  Quote required
                </label>
              </div>

              <div className="rounded-3xl bg-[#fbf7ef] p-5">
                <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={form.returnEligible}
                    onChange={(event) =>
                      updateField("returnEligible", event.target.checked)
                    }
                  />
                  Return eligible
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-neutral-950">
              Metal Details
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-3">
              <div>
                <label className={labelClass}>Metal Type</label>
                <input
                  value={form.metalType}
                  onChange={(event) =>
                    updateField("metalType", event.target.value)
                  }
                  placeholder="White Gold"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gold Karat</label>
                <input
                  value={form.goldKarat}
                  onChange={(event) =>
                    updateField("goldKarat", event.target.value)
                  }
                  placeholder="18K"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gold Weight</label>
                <input
                  value={form.goldWeight}
                  onChange={(event) =>
                    updateField("goldWeight", event.target.value)
                  }
                  placeholder="4.2g"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-neutral-950">
              Stone / Diamond Details
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-3">
              <div>
                <label className={labelClass}>Stone Type</label>
                <input
                  value={form.stoneType}
                  onChange={(event) =>
                    updateField("stoneType", event.target.value)
                  }
                  placeholder="Diamond"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Stone Weight</label>
                <input
                  value={form.stoneWeight}
                  onChange={(event) =>
                    updateField("stoneWeight", event.target.value)
                  }
                  placeholder="1.00 ct"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Certificate</label>
                <input
                  value={form.certificate}
                  onChange={(event) =>
                    updateField("certificate", event.target.value)
                  }
                  placeholder="Available on request"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Diamond Carat</label>
                <input
                  value={form.diamondCarat}
                  onChange={(event) =>
                    updateField("diamondCarat", event.target.value)
                  }
                  placeholder="1.00 ct"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Diamond Cut</label>
                <input
                  value={form.diamondCut}
                  onChange={(event) =>
                    updateField("diamondCut", event.target.value)
                  }
                  placeholder="Round Brilliant"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Diamond Color</label>
                <input
                  value={form.diamondColor}
                  onChange={(event) =>
                    updateField("diamondColor", event.target.value)
                  }
                  placeholder="G"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Diamond Clarity</label>
                <input
                  value={form.diamondClarity}
                  onChange={(event) =>
                    updateField("diamondClarity", event.target.value)
                  }
                  placeholder="VS1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gemstone Carat</label>
                <input
                  value={form.gemstoneCarat}
                  onChange={(event) =>
                    updateField("gemstoneCarat", event.target.value)
                  }
                  placeholder="1.50 ct"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gemstone Shape</label>
                <input
                  value={form.gemstoneShape}
                  onChange={(event) =>
                    updateField("gemstoneShape", event.target.value)
                  }
                  placeholder="Oval"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gemstone Origin</label>
                <input
                  value={form.gemstoneOrigin}
                  onChange={(event) =>
                    updateField("gemstoneOrigin", event.target.value)
                  }
                  placeholder="Available on request"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gemstone Treatment</label>
                <input
                  value={form.gemstoneTreatment}
                  onChange={(event) =>
                    updateField("gemstoneTreatment", event.target.value)
                  }
                  placeholder="Available on request"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <label className={labelClass}>Short Description *</label>
              <textarea
                required
                value={form.shortDescription}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
                rows={3}
                placeholder="Short product card description..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Full Description *</label>
              <textarea
                required
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={5}
                placeholder="Full product detail description..."
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? imageFile
                ? "Uploading Image & Saving..."
                : "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-950">
              Products
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {products.length} products loaded from Supabase.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
            />

            <button
              type="button"
              onClick={loadProducts}
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-[#fbf7ef] p-6 text-center text-neutral-600">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-[#fbf7ef] p-6 text-center text-neutral-600">
            No products found.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid gap-5 rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-5 lg:grid-cols-[160px_1fr_220px]"
              >
                <div className="overflow-hidden rounded-3xl border border-[#eadfca] bg-white">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-[#f5efe4] text-2xl text-[#a77a25]">
                      ◆
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                    {prettyText(product.category)} /{" "}
                    {prettyText(product.product_type)}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    /product/{product.slug}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {product.short_description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                      {product.stock_status}
                    </span>

                    <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                      {product.quote_required
                        ? `From ${formatPrice(product.estimated_price_from)}`
                        : formatPrice(product.price)}
                    </span>

                    <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                      {product.metal_type || "No metal"}
                    </span>

                    <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                      {product.stone_type || "No stone"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950 hover:bg-[#eadfca]"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === product.id}
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoadingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}