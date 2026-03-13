/**
 * LoadingOverlay — futuristic sci-fi loader shown during AI generation.
 * Displayed as a full-screen overlay while the AI builds the study kit.
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [tick, setTick] = useState(0);

  const steps = [t.loadingStep1, t.loadingStep2, t.loadingStep3, t.loadingStep4];

  useEffect(() => {
    if (!isVisible) return;
    setCurrentStep(0);
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2800);
    const tickInterval = setInterval(() => setTick((p) => p + 1), 50);
    return () => {
      clearInterval(stepInterval);
      clearInterval(tickInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(5, 8, 22, 0.95)", backdropFilter: "blur(16px)" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="flex flex-col items-center gap-10 max-w-sm w-full mx-4"
          >
            {/* Central orb with rings */}
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
              <div
                className="absolute rounded-full ai-ring-1"
                style={{
                  width: 160, height: 160,
                  border: "1.5px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.15)",
                }}
              />
              <div
                className="absolute rounded-full ai-ring-2"
                style={{
                  width: 124, height: 124,
                  border: "1.5px solid rgba(167,139,250,0.5)",
                  boxShadow: "0 0 25px rgba(167,139,250,0.3)",
                }}
              />
              <div
                className="absolute rounded-full ai-ring-3"
                style={{
                  width: 88, height: 88,
                  border: "2px solid rgba(196,181,253,0.7)",
                  boxShadow: "0 0 20px rgba(196,181,253,0.5)",
                }}
              />
              {/* Scan line */}
              <div className="absolute overflow-hidden rounded-full" style={{ width: 88, height: 88 }}>
                <div
                  className="portal-scan-bar absolute w-full"
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(167,139,250,1), transparent)",
                    boxShadow: "0 0 8px rgba(167,139,250,1)",
                  }}
                />
              </div>
              {/* Core */}
              <div
                className="relative rounded-full ai-core-pulse flex items-center justify-center"
                style={{
                  width: 56, height: 56,
                  background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(5,8,22,0.9) 70%)",
                  boxShadow: "0 0 24px rgba(139,92,246,0.6)",
                  border: "1px solid rgba(139,92,246,0.5)",
                }}
              >
                {/* Animated brain SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ai-icon-spin">
                  <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 0 8v1a4 4 0 0 1-8 0v-1a4 4 0 0 1 0-8V6a4 4 0 0 1 4-4z"
                    stroke="rgba(196,181,253,0.9)" strokeWidth="1.5" />
                  <path d="M12 8v8M8 12h8" stroke="rgba(196,181,253,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2
                className="text-xl font-bold mb-2 ai-text-glow"
                style={{ color: "rgba(196,181,253,0.95)", fontFamily: "monospace", letterSpacing: "0.06em" }}
              >
                {t.loadingTitle}
              </h2>
            </div>

            {/* Step list */}
            <div className="w-full space-y-3">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isActive ? 1 : isPast ? 0.45 : 0.2,
                      x: isActive ? 6 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    {/* Indicator dot */}
                    <div
                      className="flex-shrink-0 w-2 h-2 rounded-full"
                      style={{
                        background: isActive
                          ? "rgba(196,181,253,1)"
                          : isPast
                          ? "rgba(139,92,246,0.6)"
                          : "rgba(255,255,255,0.15)",
                        boxShadow: isActive ? "0 0 8px rgba(196,181,253,0.8)" : "none",
                        transition: "all 0.4s",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        letterSpacing: "0.04em",
                        color: isActive
                          ? "rgba(196,181,253,0.95)"
                          : isPast
                          ? "rgba(139,92,246,0.55)"
                          : "rgba(255,255,255,0.2)",
                        transition: "color 0.4s",
                      }}
                    >
                      {isPast ? "✓ " : isActive ? "> " : "  "}{step}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Neon progress bar */}
            <div
              className="w-full overflow-hidden rounded-full"
              style={{ height: 3, background: "rgba(255,255,255,0.05)" }}
            >
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(90deg, rgba(139,92,246,0.8), rgba(196,181,253,1))",
                  boxShadow: "0 0 10px rgba(167,139,250,0.8)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
