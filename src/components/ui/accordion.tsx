'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white transition-all overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:text-brand-600 transition-colors gap-4"
      >
        <span className="text-base sm:text-lg">{question}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0",
            isOpen && "transform rotate-180 text-brand-600"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items }: { items: AccordionItemProps[] }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {items.map((item, index) => (
        <AccordionItem key={item.id || index} {...item} defaultOpen={index === 0} />
      ))}
    </div>
  );
}
