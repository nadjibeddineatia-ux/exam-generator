import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flashcard } from "../lib/types";
import { RotateCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FlashcardGridProps { cards: Flashcard[] }

export function FlashcardGrid({ cards }: FlashcardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card, idx) => <FlashcardItem key={idx} card={card} index={idx} />)}
    </div>
  );
}

function FlashcardItem({ card, index }: { card: Flashcard; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="relative h-64 w-full perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-500 ease-in-out"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-card border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-shadow group-hover:border-primary/30">
          <div className="absolute top-4 right-4 text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
            <RotateCw className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest text-primary/60 font-semibold mb-4">{t.cardQuestion}</span>
          <h3 className="text-lg font-serif font-medium text-foreground">{card.question}</h3>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg rotate-y-180">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">{t.cardAnswer}</span>
          <p className="text-base text-primary-foreground/90 font-medium leading-relaxed overflow-y-auto">{card.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
