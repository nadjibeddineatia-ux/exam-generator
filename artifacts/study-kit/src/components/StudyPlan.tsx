import React from "react";
import { motion } from "framer-motion";
import { StudyPlanDay } from "../lib/types";
import { CalendarDays, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function StudyPlan({ plan }: { plan: StudyPlanDay[] }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plan.map((day, idx) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.15 }}
          className="relative bg-card border border-border/50 rounded-3xl p-6 shadow-lg shadow-black/5 flex flex-col hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="absolute -top-4 left-6 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold tracking-wider rounded-full shadow-md flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {t.dayLabel} {day.day}
          </div>
          <h3 className="text-xl font-serif font-bold text-foreground mt-4 mb-6">{day.title}</h3>
          <ul className="space-y-4 flex-1">
            {day.tasks.map((task, tIdx) => (
              <li key={tIdx} className="flex items-start gap-3 group">
                <span className="flex-shrink-0 mt-1 relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent border-2 border-card shadow-sm" />
                </span>
                <span className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">{task}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>{day.tasks.length} {t.tasksLabel}</span>
            <Target className="w-4 h-4 text-accent" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
