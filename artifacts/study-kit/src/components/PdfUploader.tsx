import React, { useCallback, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/contexts/LanguageContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

export function PdfUploader({ onFileSelect, isUploading, selectedFile, onClear }: PdfUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { t } = useLanguage();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) onFileSelect(e.target.files[0]);
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "relative group flex flex-col items-center justify-center w-full h-72 rounded-3xl border-2 border-dashed transition-all duration-300 ease-out bg-card/50 backdrop-blur-sm cursor-pointer overflow-hidden",
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-card/80 hover:shadow-xl"
            )}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center text-center px-6 pointer-events-none">
              <div className={cn(
                "p-4 rounded-full mb-4 transition-colors duration-300",
                isDragActive ? "bg-primary text-primary-foreground" : "bg-secondary text-primary group-hover:bg-primary/10"
              )}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{t.uploaderTitle}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">{t.uploaderSubtitle}</p>
            </div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/30 transition-colors" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border/50 shadow-lg shadow-black/5"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-medium text-foreground line-clamp-1">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={onClear}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
