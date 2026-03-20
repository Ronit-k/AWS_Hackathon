import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import {
  FileSearch,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Trash2,
  MessageCircle,
  Send,
  RotateCcw,
  Bot,
} from "lucide-react";

interface AnalysisResult {
  overallRisk: "low" | "medium" | "high";
  summary: string;
  flags: { type: "danger" | "warning" | "info"; text: string }[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DEMO_RESULT: AnalysisResult = {
  overallRisk: "high",
  summary:
    "This document contains several concerning clauses that may not be in your best interest. We found potentially unfair terms related to collateral, interest rates, and penalty provisions.",
  flags: [
    { type: "danger", text: "Interest rate of 36% p.a. exceeds RBI guidelines for personal loans" },
    { type: "danger", text: "Blanket collateral clause allows seizure of unrelated assets" },
    { type: "warning", text: "Vague 'miscellaneous charges' clause with no upper limit defined" },
    { type: "warning", text: "Arbitration clause removes your right to approach consumer court" },
    { type: "info", text: "Prepayment penalty of 5% is above market standard (typically 2-3%)" },
    { type: "info", text: "Auto-renewal clause requires written cancellation 90 days in advance" },
  ],
};

const DOCUMENT_SUGGESTED_QUESTIONS = [
  "What are the riskiest clauses in this document?",
  "Can I negotiate the interest rate terms?",
  "What rights do I have regarding the collateral clause?",
  "Explain the arbitration clause in simple terms",
];

const makeDocumentChatWelcome = (fileName: string): ChatMessage => ({
  id: "doc-welcome",
  role: "assistant",
  content: `I've reviewed **${fileName}** and I'm ready to answer your questions. You can ask me to explain any clause, what your rights are, or what you should do about the red flags found. What would you like to know?`,
});

const DEMO_DOC_RESPONSES: Record<string, string> = {
  default:
    "Based on the document analysis, this clause is a common risk in agreements like this. Under Indian law, such terms can sometimes be challenged if they are found to be unreasonable or unconscionable under the Contract Act, 1872. I'd recommend consulting a legal professional before signing.\n\nWould you like me to explain any other clause?",
  interest:
    "The 36% p.a. interest rate in this document exceeds the RBI's guidelines for personal loans from regulated entities. The Reserve Bank of India has issued directives limiting interest rates for various loan categories. You have the right to negotiate this rate or request a breakdown of how it's calculated.\n\nThis is a strong red flag — you should push back on this clause before signing.",
  collateral:
    "A 'blanket collateral clause' means the lender can seize any of your assets — not just those directly related to the loan — if you default. This is broader than standard practice.\n\nUnder Indian law, you can request the lender to specify exactly which assets serve as collateral. Courts have ruled against overly broad collateral clauses in several consumer protection cases.",
  arbitration:
    "The arbitration clause in this document removes your right to approach consumer courts or civil courts for dispute resolution. Instead, disputes must go to a private arbitrator, often chosen by the lender.\n\nYou still have the right to challenge the arbitration award in a High Court if the process was unfair. Under the Arbitration & Conciliation Act, 1996, the arbitrator must be impartial. Requesting that the arbitrator be mutually agreed upon (not just nominated by the lender) is a reasonable ask.",
};

const getDocResponse = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes("interest") || q.includes("rate") || q.includes("36%")) return DEMO_DOC_RESPONSES.interest;
  if (q.includes("collateral") || q.includes("asset") || q.includes("seize")) return DEMO_DOC_RESPONSES.collateral;
  if (q.includes("arbitration") || q.includes("court") || q.includes("dispute")) return DEMO_DOC_RESPONSES.arbitration;
  return DEMO_DOC_RESPONSES.default;
};

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setChatMessages([]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const analyzeDocument = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setAnalyzing(false);
      // Initialize chat with welcome message after analysis
      if (file) {
        setChatMessages([makeDocumentChatWelcome(file.name)]);
      }
    }, 2500);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getDocResponse(text),
      };
      setChatMessages((prev) => [...prev, botMsg]);
      setChatTyping(false);
    }, 1400);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(chatInput);
  };

  const riskColors = {
    low: "text-safe bg-safe-green/10 border-safe-green/20",
    medium: "text-hope bg-accent/10 border-accent/20",
    high: "text-destructive bg-destructive/10 border-destructive/20",
  };

  const flagIcons = {
    danger: <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-hope flex-shrink-0 mt-0.5" />,
    info: <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-10 md:py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-4">
              <FileSearch className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Document Analysis
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload a legal document and our AI will highlight risky clauses, unfair terms, and red flags in plain language.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              Files are processed securely and never stored
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Upload area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-colors ${
              dragOver
                ? "border-primary bg-sage-light/50"
                : "border-border hover:border-primary/30"
            }`}
          >
            {!file ? (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag &amp; drop your document here, or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)
                </p>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setFile(null); setResult(null); setChatMessages([]); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="hero"
                    onClick={analyzeDocument}
                    disabled={analyzing}
                    className="gap-2"
                  >
                    {analyzing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileSearch className="w-4 h-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Results */}
        {result && (
          <ScrollReveal delay={0}>
            <div className="mt-8 space-y-6">
              {/* Risk Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${riskColors[result.overallRisk]}`}>
                {result.overallRisk === "high" && <AlertTriangle className="w-4 h-4" />}
                {result.overallRisk === "medium" && <AlertTriangle className="w-4 h-4" />}
                {result.overallRisk === "low" && <CheckCircle className="w-4 h-4" />}
                Overall Risk: {result.overallRisk.charAt(0).toUpperCase() + result.overallRisk.slice(1)}
              </div>

              {/* Summary */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display text-lg text-foreground mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>

              {/* Flags */}
              <div className="space-y-3">
                <h3 className="font-display text-lg text-foreground">Findings</h3>
                {result.flags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-card border border-border/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    {flagIcons[flag.type]}
                    <p className="text-sm text-foreground leading-relaxed">{flag.text}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                This analysis is AI-generated and should be reviewed by a qualified legal professional.
              </p>

              {/* ── Document Chat ─────────────────────────────────── */}
              <div className="mt-4 border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-sage-light/40 border-b border-border">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Ask about this document</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe-green inline-block animate-pulse-gentle" />
                      AI is aware of your document's contents
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    title="Reset chat"
                    onClick={() => file && setChatMessages([makeDocumentChatWelcome(file.name)])}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Messages area */}
                <div className="flex flex-col h-72 bg-background">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                            msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatTyping && (
                      <div className="flex gap-2 justify-start animate-fade-in">
                        <div className="w-6 h-6 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="chat-bubble-bot px-4 py-3 text-sm text-muted-foreground">
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggested questions — only shown initially */}
                  {chatMessages.length <= 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                      {DOCUMENT_SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendChatMessage(q)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-primary/20 text-primary bg-sage-light/50 hover:bg-sage-light transition-colors active:scale-[0.97]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <form
                    onSubmit={handleChatSubmit}
                    className="flex items-center gap-2 border-t border-border px-3 py-2 bg-card"
                  >
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask anything about this document…"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="default"
                      disabled={!chatInput.trim() || chatTyping}
                      className="rounded-xl w-8 h-8"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
              {/* ── End Document Chat ─────────────────────────────── */}
            </div>
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
