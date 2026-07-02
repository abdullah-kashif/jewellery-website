export function createProductSlug(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

export function normalizeProductSlug(slug: unknown, productName: unknown) {
  return createProductSlug(slug) || createProductSlug(productName);
}

export function decodeProductSlug(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

export function isValidProductSlug(value: unknown) {
  const slug = String(value || "");
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
}
