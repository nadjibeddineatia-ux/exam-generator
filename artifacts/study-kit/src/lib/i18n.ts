/**
 * i18n translations dictionary.
 *
 * HOW TO ADD A NEW LANGUAGE:
 * 1. Copy the `en` block below and give it a new key (e.g. "es", "de").
 * 2. Translate every value string.
 * 3. Add the new key to the `Language` union type.
 * 4. Add a display entry to the `LANGUAGES` array.
 * 5. If the language is RTL, add it to the `RTL_LANGUAGES` set.
 */

export type Language = "en" | "fr" | "ar";

export interface Translations {
  // Branding
  brandName: string;
  brandTagline: string;

  // Header
  startOver: string;
  downloadPdf: string;

  // Hero
  poweredByAi: string;
  heroLine1: string;
  heroLine2: string;
  heroDescription: string;

  // Uploader
  uploaderTitle: string;
  uploaderSubtitle: string;

  // Buttons
  generateBtn: string;
  downloadFullBtn: string;
  preparingPdf: string;

  // Section headings
  summaryTitle: string;
  summarySubtitle: string;
  flashcardsTitle: string;
  flashcardsSubtitle: string;
  cardsLabel: string;
  quizTitle: string;
  quizSubtitle: string;
  studyPlanTitle: string;
  studyPlanSubtitle: string;

  // Flashcard labels
  cardQuestion: string;
  cardAnswer: string;

  // Study plan
  dayLabel: string;
  tasksLabel: string;

  // Loading overlay
  loadingTitle: string;
  loadingStep1: string;
  loadingStep2: string;
  loadingStep3: string;
  loadingStep4: string;

  // Upload loader
  uploadScanningTitle: string;
  uploadScanningMsg: string;

  // Toast messages
  toastUploadSuccess: string;
  toastUploadSuccessDesc: (pages: number, name: string) => string;
  toastUploadFail: string;
  toastGenerateFail: string;
  toastGenerateSuccess: string;
  toastGenerateSuccessDesc: string;
  toastDownloadStart: string;
  toastDownloadStartDesc: string;
  toastDownloadFail: string;
}

const en: Translations = {
  brandName: "Lumina",
  brandTagline: "Study Kit Generator",

  startOver: "Start Over",
  downloadPdf: "Download PDF",

  poweredByAi: "Powered by AI",
  heroLine1: "Turn any lecture into a",
  heroLine2: "master study kit.",
  heroDescription:
    "Upload your syllabus or lecture PDF. We'll extract the core concepts, generate flashcards, create a practice quiz, and build a focused 3-day cram plan.",

  uploaderTitle: "Upload your lecture PDF",
  uploaderSubtitle:
    "Drag and drop your syllabus or lecture notes here, or click to browse. We'll extract the text and build your study kit.",

  generateBtn: "Generate Study Kit",
  downloadFullBtn: "Download Complete Study Kit",
  preparingPdf: "Preparing PDF...",

  summaryTitle: "Lecture Summary",
  summarySubtitle: "The core concepts distilled into one simple overview.",
  flashcardsTitle: "Must-Know Flashcards",
  flashcardsSubtitle: "Click any card to reveal the answer.",
  cardsLabel: "Cards",
  quizTitle: "Practice Quiz",
  quizSubtitle: "Test your knowledge before the exam.",
  studyPlanTitle: "3-Day Cram Plan",
  studyPlanSubtitle: "Your optimized schedule to master the material.",

  cardQuestion: "Question",
  cardAnswer: "Answer",

  dayLabel: "DAY",
  tasksLabel: "Tasks",

  loadingTitle: "Crafting your material",
  loadingStep1: "Reading your lecture notes...",
  loadingStep2: "Synthesizing key concepts...",
  loadingStep3: "Generating smart flashcards...",
  loadingStep4: "Finalizing your study kit...",

  uploadScanningTitle: "Processing PDF",
  uploadScanningMsg: "Scanning and extracting text from your document...",

  toastUploadSuccess: "File processed successfully",
  toastUploadSuccessDesc: (pages, name) => `Extracted ${pages} pages from ${name}.`,
  toastUploadFail: "Upload Failed",
  toastGenerateFail: "Generation Failed",
  toastGenerateSuccess: "Study Kit Ready!",
  toastGenerateSuccessDesc: "Your AI-powered study materials are ready.",
  toastDownloadStart: "Download Started",
  toastDownloadStartDesc: "Your PDF is downloading.",
  toastDownloadFail: "Download Failed",
};

const fr: Translations = {
  brandName: "Lumina",
  brandTagline: "Générateur de Kit d'Étude",

  startOver: "Recommencer",
  downloadPdf: "Télécharger PDF",

  poweredByAi: "Propulsé par l'IA",
  heroLine1: "Transformez n'importe quel cours en",
  heroLine2: "kit d'étude complet.",
  heroDescription:
    "Téléchargez votre syllabus ou vos notes de cours en PDF. Nous extrairons les concepts clés, créerons des flashcards, un quiz d'entraînement et un plan de révision sur 3 jours.",

  uploaderTitle: "Téléchargez votre PDF de cours",
  uploaderSubtitle:
    "Glissez-déposez votre syllabus ou vos notes ici, ou cliquez pour parcourir. Nous extrairons le texte et construirons votre kit d'étude.",

  generateBtn: "Générer le Kit",
  downloadFullBtn: "Télécharger le Kit Complet",
  preparingPdf: "Préparation du PDF...",

  summaryTitle: "Résumé du Cours",
  summarySubtitle: "Les concepts clés résumés en un aperçu simple.",
  flashcardsTitle: "Flashcards Essentielles",
  flashcardsSubtitle: "Cliquez sur une carte pour voir la réponse.",
  cardsLabel: "Cartes",
  quizTitle: "Quiz de Pratique",
  quizSubtitle: "Testez vos connaissances avant l'examen.",
  studyPlanTitle: "Plan de Révision sur 3 Jours",
  studyPlanSubtitle: "Votre calendrier optimisé pour maîtriser la matière.",

  cardQuestion: "Question",
  cardAnswer: "Réponse",

  dayLabel: "JOUR",
  tasksLabel: "Tâches",

  loadingTitle: "Création de votre matériel",
  loadingStep1: "Lecture de vos notes de cours...",
  loadingStep2: "Synthèse des concepts clés...",
  loadingStep3: "Génération des flashcards...",
  loadingStep4: "Finalisation de votre kit d'étude...",

  uploadScanningTitle: "Traitement du PDF",
  uploadScanningMsg: "Analyse et extraction du texte de votre document...",

  toastUploadSuccess: "Fichier traité avec succès",
  toastUploadSuccessDesc: (pages, name) => `${pages} pages extraites de ${name}.`,
  toastUploadFail: "Échec du téléchargement",
  toastGenerateFail: "Échec de la génération",
  toastGenerateSuccess: "Kit d'étude prêt !",
  toastGenerateSuccessDesc: "Vos supports d'étude IA sont prêts.",
  toastDownloadStart: "Téléchargement démarré",
  toastDownloadStartDesc: "Votre PDF est en cours de téléchargement.",
  toastDownloadFail: "Échec du téléchargement",
};

const ar: Translations = {
  brandName: "لومينا",
  brandTagline: "مولّد مجموعة الدراسة",

  startOver: "البدء من جديد",
  downloadPdf: "تحميل PDF",

  poweredByAi: "مدعوم بالذكاء الاصطناعي",
  heroLine1: "حوّل أي محاضرة إلى",
  heroLine2: "مجموعة دراسة متكاملة.",
  heroDescription:
    "ارفع ملف المحاضرة أو المقرر. سنستخرج المفاهيم الأساسية، وننشئ بطاقات تعليمية، واختبارًا تدريبيًا، وخطة مراجعة على مدار 3 أيام.",

  uploaderTitle: "ارفع ملف PDF الخاص بمحاضرتك",
  uploaderSubtitle:
    "اسحب وأفلت ملف المحاضرة هنا، أو انقر للاختيار. سنستخرج النص وننشئ مجموعة الدراسة الخاصة بك.",

  generateBtn: "إنشاء مجموعة الدراسة",
  downloadFullBtn: "تحميل مجموعة الدراسة الكاملة",
  preparingPdf: "جاري التحضير...",

  summaryTitle: "ملخص المحاضرة",
  summarySubtitle: "المفاهيم الأساسية في نظرة واحدة بسيطة.",
  flashcardsTitle: "البطاقات التعليمية الأساسية",
  flashcardsSubtitle: "انقر على البطاقة لعرض الإجابة.",
  cardsLabel: "بطاقات",
  quizTitle: "اختبار تدريبي",
  quizSubtitle: "اختبر معرفتك قبل الامتحان.",
  studyPlanTitle: "خطة المراجعة لـ 3 أيام",
  studyPlanSubtitle: "جدولك المُحسَّن لإتقان المادة.",

  cardQuestion: "سؤال",
  cardAnswer: "إجابة",

  dayLabel: "اليوم",
  tasksLabel: "مهام",

  loadingTitle: "إنشاء مواد الدراسة",
  loadingStep1: "قراءة ملاحظات المحاضرة...",
  loadingStep2: "استخلاص المفاهيم الرئيسية...",
  loadingStep3: "إنشاء البطاقات التعليمية...",
  loadingStep4: "إنهاء مجموعة الدراسة...",

  uploadScanningTitle: "معالجة الملف",
  uploadScanningMsg: "جارٍ مسح واستخراج النص من مستندك...",

  toastUploadSuccess: "تم معالجة الملف بنجاح",
  toastUploadSuccessDesc: (pages, name) => `تم استخراج ${pages} صفحات من ${name}.`,
  toastUploadFail: "فشل الرفع",
  toastGenerateFail: "فشل الإنشاء",
  toastGenerateSuccess: "مجموعة الدراسة جاهزة!",
  toastGenerateSuccessDesc: "مواد الدراسة المدعومة بالذكاء الاصطناعي جاهزة.",
  toastDownloadStart: "بدأ التحميل",
  toastDownloadStartDesc: "جارٍ تحميل ملف PDF الخاص بك.",
  toastDownloadFail: "فشل التحميل",
};

export const translations: Record<Language, Translations> = { en, fr, ar };

/** Languages displayed in the selector.
 * Add new entries here when adding a new language. */
export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
];

/** RTL languages — direction="rtl" will be applied automatically. */
export const RTL_LANGUAGES = new Set<Language>(["ar"]);
