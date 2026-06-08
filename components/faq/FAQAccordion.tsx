"use client";

import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-3xl border border-[#eadfca] bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                  {item.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                  {item.question}
                </h3>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf7ef] text-xl text-[#a77a25]">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[#eadfca] px-6 py-5">
                <p className="leading-7 text-neutral-600">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}