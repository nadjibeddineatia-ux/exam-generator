import { useMutation } from "@tanstack/react-query";
import { ExtractedPdfText, StudyKit } from "../lib/types";

// Upload PDF & Extract Text
export function useUploadPdf() {
  return useMutation({
    mutationFn: async (file: File): Promise<ExtractedPdfText> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/study-kit/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to upload PDF" }));
        throw new Error(err.error || "Failed to upload PDF");
      }

      return res.json();
    },
  });
}

// Generate Study Kit from Extracted Text
export function useGenerateStudyKit() {
  return useMutation({
    mutationFn: async (data: { text: string; fileName: string }): Promise<StudyKit> => {
      const res = await fetch("/api/study-kit/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to generate study kit" }));
        throw new Error(err.error || "Failed to generate study kit");
      }

      return res.json();
    },
  });
}

// Download Study Kit as PDF
export function useDownloadPdf() {
  return useMutation({
    mutationFn: async (studyKit: StudyKit) => {
      const res = await fetch("/api/study-kit/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studyKit),
      });

      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }

      // Convert response to Blob and trigger download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${studyKit.fileName ? studyKit.fileName.replace('.pdf', '') : 'study-kit'}-study-guide.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}
