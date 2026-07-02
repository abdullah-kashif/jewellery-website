import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type HeroLink = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type PageIntroHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  theme?: "light" | "dark";
  children?: ReactNode;
  actions?: HeroLink[];
};

export function PageIntroHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  theme = "light",
  children,
  actions = [],
}: PageIntroHeroProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden border-b border-[#eadfca] px-4 py-14 md:py-16 ${
        isDark ? "bg-neutral-950 text-white" : "bg-white text-neutral-950"
      }`}
    >
      {isDark ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8a651d55,transparent_35%),linear-gradient(120deg,#0a0a0a,#1f1a12)]" />
      ) : null}

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p
            className={`text-sm tracking-[0.3em] uppercase ${
              isDark ? "text-[#d6b46a]" : "text-[#a77a25]"
            }`}
          >
            {eyebrow}
          </p>

          <h1
            className={`mt-4 text-4xl font-semibold leading-tight md:text-6xl ${
              isDark ? "text-white" : "text-neutral-950"
            }`}
          >
            {title}
          </h1>

          <p
            className={`mt-5 max-w-3xl text-base leading-8 md:text-lg ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            {description}
          </p>

          {children}

          {actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map((action) => {
                const primary = action.variant !== "secondary";
                const className = primary
                  ? isDark
                    ? "rounded-full bg-[#d6b46a] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase transition hover:bg-white"
                    : "rounded-full bg-neutral-950 px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#a77a25]"
                  : isDark
                    ? "rounded-full border border-white/30 px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
                    : "rounded-full border border-[#d6b46a] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase transition hover:bg-[#d6b46a] hover:text-neutral-950";

                return (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={className}
                  >
                    {action.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <div
          className={`relative min-h-[260px] overflow-hidden rounded-[2rem] border shadow-sm md:min-h-[360px] ${
            isDark
              ? "border-white/10 bg-white/10 shadow-2xl"
              : "border-[#eadfca] bg-[#fbf7ef]"
          }`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover"
            priority
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-t from-black/15 via-transparent to-transparent"
                : "bg-gradient-to-t from-white/10 via-transparent to-transparent"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
