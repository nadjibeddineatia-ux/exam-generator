import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import PDFDocument from "pdfkit";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  GenerateStudyKitBody,
  GenerateStudyKitResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post("/study-kit/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    if (!req.file.mimetype.includes("pdf") && !req.file.originalname.toLowerCase().endsWith(".pdf")) {
      res.status(400).json({ error: "Only PDF files are supported" });
      return;
    }
    const data = await pdfParse(req.file.buffer);
    res.json({
      text: data.text,
      pageCount: data.numpages,
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

router.post("/study-kit/generate", async (req: Request, res: Response) => {
  try {
    const body = GenerateStudyKitBody.parse(req.body);
    const { text, fileName } = body;

    if (!text || text.trim().length < 50) {
      res.status(400).json({ error: "PDF text is too short to generate a study kit" });
      return;
    }

    const truncatedText = text.slice(0, 12000);

    const prompt = `You are an expert university tutor. Based on the following lecture content, create a comprehensive study kit.

Lecture content:
${truncatedText}

Return your response as valid JSON with this exact structure:
{
  "summary": "A clear 3-5 paragraph summary of the key concepts",
  "flashcards": [
    { "question": "...", "answer": "..." }
  ],
  "quizQuestions": [
    { "question": "...", "answer": "..." }
  ],
  "studyPlan": [
    { "day": 1, "title": "Day 1: ...", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 2, "title": "Day 2: ...", "tasks": ["task 1", "task 2", "task 3"] },
    { "day": 3, "title": "Day 3: ...", "tasks": ["task 1", "task 2", "task 3"] }
  ]
}

Rules:
- Generate exactly 12 flashcards covering the most important concepts
- Generate exactly 5 exam-style quiz questions with detailed answers
- The 3-day study plan should have 4-5 tasks per day, progressing from foundation to mastery
- Keep all content student-friendly and academically accurate
- Return ONLY the JSON, no other text`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0]?.message?.content ?? "";
    
    let studyKit;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      studyKit = JSON.parse(jsonMatch[0]);
    } catch {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const parsed = GenerateStudyKitResponse.parse({
      ...studyKit,
      fileName: fileName ?? null,
    });

    res.json(parsed);
  } catch (err) {
    console.error("Study kit generation error:", err);
    res.status(500).json({ error: "Failed to generate study kit" });
  }
});

router.post("/study-kit/download", async (req: Request, res: Response) => {
  try {
    const { summary, flashcards, quizQuestions, studyPlan, fileName } = req.body;

    if (!summary || !flashcards || !quizQuestions || !studyPlan) {
      res.status(400).json({ error: "Missing study kit data" });
      return;
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="study-kit-${Date.now()}.pdf"`
    );

    doc.pipe(res);

    const primaryColor = "#4F46E5";
    const textColor = "#1F2937";
    const mutedColor = "#6B7280";

    const addSectionHeader = (title: string, icon: string = "") => {
      doc.moveDown(0.5);
      doc.rect(50, doc.y, 495, 32).fill(primaryColor);
      doc.fillColor("white").fontSize(14).font("Helvetica-Bold")
        .text(`  ${icon} ${title}`, 50, doc.y - 26, { width: 495, align: "left" });
      doc.fillColor(textColor);
      doc.moveDown(0.5);
    };

    doc.fontSize(26).font("Helvetica-Bold").fillColor(primaryColor)
      .text("AI Study Kit", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(12).font("Helvetica").fillColor(mutedColor)
      .text(fileName ? `Source: ${fileName}` : "Generated Study Kit", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(10).fillColor(mutedColor)
      .text(`Generated on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`, { align: "center" });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").lineWidth(1).stroke();
    doc.moveDown(1);

    addSectionHeader("Lecture Summary", "📚");
    doc.fontSize(11).font("Helvetica").fillColor(textColor)
      .text(summary, { lineGap: 4, paragraphGap: 6 });
    doc.moveDown(1.5);

    addSectionHeader("Flashcards (12 Cards)", "🃏");
    doc.moveDown(0.5);

    flashcards.forEach((card: { question: string; answer: string }, i: number) => {
      if (doc.y > 700) doc.addPage();
      const cardY = doc.y;
      doc.rect(55, cardY, 485, 1).fill("#E5E7EB");
      doc.moveDown(0.4);
      doc.fontSize(10).font("Helvetica-Bold").fillColor(primaryColor)
        .text(`Q${i + 1}:`, 55, doc.y, { continued: true });
      doc.fontSize(10).font("Helvetica-Bold").fillColor(textColor)
        .text(` ${card.question}`, { lineGap: 2 });
      doc.fontSize(10).font("Helvetica").fillColor(mutedColor)
        .text(`A: `, 55, doc.y + 3, { continued: true });
      doc.fontSize(10).font("Helvetica").fillColor("#374151")
        .text(card.answer, { lineGap: 2 });
      doc.moveDown(0.7);
    });

    doc.moveDown(1);
    addSectionHeader("Exam Questions (5 Questions)", "📝");
    doc.moveDown(0.5);

    quizQuestions.forEach((q: { question: string; answer: string }, i: number) => {
      if (doc.y > 680) doc.addPage();
      doc.fontSize(11).font("Helvetica-Bold").fillColor(textColor)
        .text(`${i + 1}. ${q.question}`, { lineGap: 2 });
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica-Bold").fillColor(primaryColor)
        .text("Answer:", { continued: true });
      doc.fontSize(10).font("Helvetica").fillColor("#374151")
        .text(` ${q.answer}`, { lineGap: 2 });
      doc.moveDown(1);
    });

    doc.addPage();
    addSectionHeader("3-Day Study Plan", "📅");
    doc.moveDown(0.5);

    const dayColors = [primaryColor, "#059669", "#D97706"];
    studyPlan.forEach((day: { day: number; title: string; tasks: string[] }, i: number) => {
      if (doc.y > 650) doc.addPage();
      const color = dayColors[i % dayColors.length];
      doc.rect(55, doc.y, 485, 28).fill(color + "22");
      doc.rect(55, doc.y, 4, 28).fill(color);
      doc.fontSize(12).font("Helvetica-Bold").fillColor(color)
        .text(`  ${day.title}`, 62, doc.y - 20, { width: 475 });
      doc.fillColor(textColor);
      doc.moveDown(0.5);
      day.tasks.forEach((task: string) => {
        doc.fontSize(10).font("Helvetica").fillColor(textColor)
          .text(`    ◆ ${task}`, { lineGap: 3, indent: 10 });
      });
      doc.moveDown(1);
    });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").lineWidth(1).stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).font("Helvetica").fillColor(mutedColor)
      .text("Generated by AI Study Kit Generator", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF download error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
});

export default router;
