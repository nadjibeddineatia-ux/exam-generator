import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "../lib/types";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {questions.map((q, idx) => (
        <QuizItem key={idx} question={q} index={idx} />
      ))}
    </div>
  );
}

function QuizItem({ question, index }: { question: QuizQuestion; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none focus:bg-secondary/30 transition-colors"
      >
        <div className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <h4 className="font-serif font-medium text-foreground text-lg pt-0.5 leading-snug">
            {question.question}
          </h4>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-muted-foreground mt-1"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 pl-[4.5rem]">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 relative">
                <div className="absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 bg-card rounded-full border border-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  {question.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
