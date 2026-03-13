/**
 * FuturisticUploadLoader — sci-fi themed PDF upload animation.
 *
 * HOW TO CUSTOMIZE THE LOADER:
 * - Change ring colors: edit the `borderColor` / `boxShadow` inline styles on the ring divs.
 * - Change the number of particles: adjust the `particles` array length.
 * - Change animation speed: edit the animation-duration values in index.css under @keyframes portal-*.
 * - Swap the icon: replace the SVG path inside the center circle.
 */

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  isVisible: boolean;
}

const NUM_PARTICLES = 18;

export function FuturisticUploadLoader({ isVisible }: Props) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Simple canvas particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        hue: Math.random() * 60 + 140, // teal-to-green range
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${particles[i].hue}, 90%, 60%, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.hue = ((p.hue + 0.2) % 360);
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(5, 8, 22, 0.92)", backdropFilter: "blur(12px)" }}
        >
          {/* Particle canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Main portal card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative flex flex-col items-center gap-8 z-10"
          >
            {/* Glowing portal rings */}
            <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
              {/* Outer ring */}
              <div
                className="absolute rounded-full portal-ring-1"
                style={{
                  width: 180, height: 180,
                  border: "2px solid rgba(74,222,128,0.3)",
                  boxShadow: "0 0 30px rgba(74,222,128,0.2), inset 0 0 30px rgba(74,222,128,0.05)",
                }}
              />
              {/* Middle ring */}
              <div
                className="absolute rounded-full portal-ring-2"
                style={{
                  width: 140, height: 140,
                  border: "2px solid rgba(52,211,153,0.5)",
                  boxShadow: "0 0 20px rgba(52,211,153,0.4), inset 0 0 20px rgba(52,211,153,0.1)",
                }}
              />
              {/* Inner ring */}
              <div
                className="absolute rounded-full portal-ring-3"
                style={{
                  width: 100, height: 100,
                  border: "2px solid rgba(16,185,129,0.7)",
                  boxShadow: "0 0 25px rgba(16,185,129,0.6), inset 0 0 15px rgba(16,185,129,0.2)",
                }}
              />
              {/* Neon scan bar */}
              <div className="absolute overflow-hidden rounded-full" style={{ width: 100, height: 100 }}>
                <div
                  className="portal-scan-bar absolute w-full"
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.9), transparent)",
                    boxShadow: "0 0 8px rgba(74,222,128,1)",
                  }}
                />
              </div>
              {/* Center icon */}
              <div
                className="relative flex items-center justify-center rounded-full portal-pulse"
                style={{
                  width: 64, height: 64,
                  background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,8,22,0.9) 70%)",
                  boxShadow: "0 0 20px rgba(16,185,129,0.5)",
                  border: "1px solid rgba(16,185,129,0.4)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" strokeLinecap="round"
                  />
                  <path d="M14 2v6h6" stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 18v-6M9 15l3 3 3-3" stroke="rgba(52,211,153,1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3 px-6">
              <h2
                className="text-2xl font-bold portal-text-glow"
                style={{ color: "rgba(74,222,128,0.95)", fontFamily: "monospace", letterSpacing: "0.08em" }}
              >
                {t.uploadScanningTitle}
              </h2>
              <p style={{ color: "rgba(52,211,153,0.6)", fontSize: "0.85rem", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {t.uploadScanningMsg}
              </p>

              {/* Neon progress bar */}
              <div
                className="mx-auto mt-2 overflow-hidden rounded-full"
                style={{ width: 220, height: 4, background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="h-full rounded-full portal-progress"
                  style={{
                    background: "linear-gradient(90deg, rgba(16,185,129,0.8), rgba(74,222,128,1), rgba(52,211,153,0.8))",
                    boxShadow: "0 0 10px rgba(74,222,128,0.8)",
                  }}
                />
              </div>

              {/* Blinking cursor dots */}
              <div className="flex justify-center gap-2 pt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-full portal-dot"
                    style={{
                      width: 6, height: 6,
                      background: "rgba(74,222,128,0.8)",
                      boxShadow: "0 0 6px rgba(74,222,128,0.8)",
                      animationDelay: `${i * 0.25}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
