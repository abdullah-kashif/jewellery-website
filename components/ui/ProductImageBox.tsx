import { getProductImage } from "@/lib/product-images";

type ProductImageBoxProps = {
  slug: string;
  name: string;
  className?: string;
  imageClassName?: string;
};

export function ProductImageBox({
  slug,
  name,
  className = "",
  imageClassName = "",
}: ProductImageBoxProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff8ec] via-white to-[#d6b46a] ${className}`}
    >
      <img
        src={getProductImage(slug)}
        alt={name}
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${imageClassName}`}
        loading="lazy"
      />
    </div>
  );
}