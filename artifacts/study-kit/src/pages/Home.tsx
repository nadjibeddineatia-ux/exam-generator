import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { BookOpen, Sparkles, Download, ArrowRight, RefreshCcw, Globe } from "lucide-react";

import { useUploadPdf, useGenerateStudyKit, useDownloadPdf } from "@/hooks/use-study-kit";
import { ExtractedPdfText, StudyKit as StudyKitType } from "@/lib/types";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

import { PdfUploader } from "@/components/PdfUploader";
import { FlashcardGrid } from "@/components/FlashcardGrid";
import { QuizSection } from "@/components/QuizSection";
import { StudyPlan } from "@/components/StudyPlan";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { FuturisticUploadLoader } from "@/components/FuturisticUploadLoader";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { t, language, setLanguage, isRtl } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedPdfText | null>(null);
  const [studyKit, setStudyKit] = useState<StudyKitType | null>(null);

  const uploadMutation = useUploadPdf();
  const generateMutation = useGenerateStudyKit();
  const downloadMutation = useDownloadPdf();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    try {
      const data = await uploadMutation.mutateAsync(selectedFile);
      setExtractedData(data);
      toast({
        title: t.toastUploadSuccess,
        description: t.toastUploadSuccessDesc(data.pageCount, data.fileName),
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: t.toastUploadFail, description: err.message });
      setFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!extractedData) return;
    try {
      const result = await generateMutation.mutateAsync({
        text: extractedData.text,
        fileName: extractedData.fileName,
      });
      setStudyKit(result);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#1e293b', '#fbbf24', '#f1f5f9'] });
      toast({ title: t.toastGenerateSuccess, description: t.toastGenerateSuccessDesc });
    } catch (err: any) {
      toast({ variant: "destructive", title: t.toastGenerateFail, description: err.message });
    }
  };

  const handleDownload = async () => {
    if (!studyKit) return;
    try {
      await downloadMutation.mutateAsync(studyKit);
      toast({ title: t.toastDownloadStart, description: t.toastDownloadStartDesc });
    } catch (err: any) {
      toast({ variant: "destructive", title: t.toastDownloadFail, description: err.message });
    }
  };

  const handleReset = () => { setFile(null); setExtractedData(null); setStudyKit(null); };

  return (
    <div className="min-h-screen pb-24" dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Futuristic upload loader ── */}
      <FuturisticUploadLoader isVisible={uploadMutation.isPending} />
      {/* ── AI generation overlay ── */}
      <LoadingOverlay isVisible={generateMutation.isPending} />

      {/* ── Header ── */}
      <header className="w-full bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground leading-tight">{t.brandName}</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t.brandTagline}</p>
            </div>
          </div>

          {/* Right side: language selector + action buttons */}
          <div className="flex items-center gap-3">
            {/* ── Language Selector ──
                HOW TO ADD MORE LANGUAGES:
                1. Add the translation block to src/lib/i18n.ts
                2. Add an entry to the LANGUAGES array in i18n.ts
                3. If RTL, add the code to RTL_LANGUAGES set in i18n.ts
                That's it — the selector and direction will update automatically. */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {LANGUAGES.find((l) => l.code === language)?.nativeLabel}
                </span>
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-0 z-50 bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden min-w-[150px]"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-secondary/60 flex items-center justify-between gap-4 ${
                          language === lang.code ? "text-primary font-semibold bg-primary/5" : "text-foreground"
                        }`}
                      >
                        <span>{lang.nativeLabel}</span>
                        {language === lang.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click-away */}
              {langMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
              )}
            </div>

            {/* Action buttons — only shown when study kit is ready */}
            {studyKit && (
              <>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t.startOver}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {downloadMutation.isPending ? <Sparkles className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {t.downloadPdf}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <AnimatePresence mode="wait">
          {!studyKit ? (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center mt-12 md:mt-24"
            >
              {/* Hero text */}
              <div className="text-center max-w-2xl mb-12">
                <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 text-accent-foreground font-semibold text-sm mb-6 border border-accent/30">
                  {t.poweredByAi}
                </span>
                <h2 className="text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
                  {t.heroLine1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    {t.heroLine2}
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t.heroDescription}</p>
              </div>

              <PdfUploader
                onFileSelect={handleFileSelect}
                isUploading={uploadMutation.isPending}
                selectedFile={file}
                onClear={handleReset}
              />

              <AnimatePresence>
                {extractedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    className="mt-12"
                  >
                    <button
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending}
                      className="px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                    >
                      {t.generateBtn}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-24"
            >
              {/* Summary */}
              <section>
                <div className="mb-8 border-l-4 border-accent pl-6">
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{t.summaryTitle}</h2>
                  <p className="text-muted-foreground font-medium">{t.summarySubtitle}</p>
                </div>
                <div className="bg-card border border-border/60 p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <BookOpen className="w-32 h-32 text-primary" />
                  </div>
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-serif relative z-10">
                    {studyKit.summary}
                  </p>
                </div>
              </section>

              {/* Flashcards */}
              <section>
                <div className="mb-8 border-l-4 border-primary pl-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{t.flashcardsTitle}</h2>
                    <p className="text-muted-foreground font-medium">{t.flashcardsSubtitle}</p>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-secondary text-primary rounded-xl font-bold">
                    {studyKit.flashcards.length} {t.cardsLabel}
                  </div>
                </div>
                <FlashcardGrid cards={studyKit.flashcards} />
              </section>

              {/* Quiz */}
              <section>
                <div className="mb-8 border-l-4 border-destructive pl-6">
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{t.quizTitle}</h2>
                  <p className="text-muted-foreground font-medium">{t.quizSubtitle}</p>
                </div>
                <QuizSection questions={studyKit.quizQuestions} />
              </section>

              {/* Study Plan */}
              <section>
                <div className="mb-8 border-l-4 border-accent pl-6">
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">{t.studyPlanTitle}</h2>
                  <p className="text-muted-foreground font-medium">{t.studyPlanSubtitle}</p>
                </div>
                <StudyPlan plan={studyKit.studyPlan} />
              </section>

              {/* Bottom download */}
              <div className="flex justify-center pt-12 pb-12 border-t border-border">
                <button
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="px-10 py-5 bg-foreground text-background text-lg font-bold rounded-2xl shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  {downloadMutation.isPending ? t.preparingPdf : t.downloadFullBtn}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
