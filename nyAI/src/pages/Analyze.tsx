import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { postQuery } from "@/lib/api";
import {
  Bot,
  FileSearch,
  FileText,
  MessageCircle,
  RotateCcw,
  Scale,
  Send,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";

interface AnalysisResult {
  summary: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DOCUMENT_SUGGESTED_QUESTIONS = [
  "What are the riskiest clauses in this document?",
  "Can I negotiate the interest rate terms?",
  "What rights do I have regarding the collateral clause?",
  "Explain the arbitration clause in simple terms",
];

const makeDocumentChatWelcome = (fileName: string): ChatMessage => ({
  id: "doc-welcome",
  role: "assistant",
  content: `I have a backend analysis ready for ${fileName}. Ask me anything else about this document.`,
});

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  const handleFile = (nextFile: File) => {
    setFile(nextFile);
    setResult(null);
    setChatMessages([]);
    setChatInput("");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, []);

  const analyzeDocument = async () => {
    if (!file || analyzing) {
      return;
    }

    const analysisQuery = file.name.toLowerCase().endsWith(".pdf")
      ? "What is the pdf about?"
      : "What is the document about?";

    setAnalyzing(true);
    setResult(null);
    setChatMessages([]);

    try {
      const response = await postQuery("doc_analyzer", analysisQuery);
      setResult({ summary: response });
      setChatMessages([makeDocumentChatWelcome(file.name)]);
    } catch (error) {
      const message =
        error instanceof Error
          ? `I couldn't reach the doc_analyzer backend right now. ${error.message}`
          : "I couldn't reach the doc_analyzer backend right now.";

      setResult({ summary: message });
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || chatTyping) {
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedText,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatTyping(true);

    try {
      const response = await postQuery("doc_analyzer", trimmedText);

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? `I couldn't reach the doc_analyzer backend right now. ${error.message}`
          : "I couldn't reach the doc_analyzer backend right now.";

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setChatTyping(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendChatMessage(chatInput);
  };

  const clearSelectedFile = () => {
    setFile(null);
    setResult(null);
    setChatMessages([]);
    setChatInput("");
    setAnalyzing(false);
    setChatTyping(false);
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
              Ask the backend document analyzer for a summary or follow-up answers using the doc_analyzer endpoint.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
              <Scale className="w-3 h-3" />
              Requests are sent as JSON with a single query field
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-colors ${dragOver ? "border-primary bg-sage-light/50" : "border-border hover:border-primary/30"
              }`}
          >
            {!file ? (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your document here, or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        handleFile(selectedFile);
                      }
                    }}
                  />
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG
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
                  <Button variant="ghost" size="icon" onClick={clearSelectedFile}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="hero" onClick={() => void analyzeDocument()} disabled={analyzing} className="gap-2">
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

        {result && (
          <ScrollReveal delay={0}>
            <div className="mt-8 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display text-lg text-foreground mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.summary}</p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                This content comes directly from the backend response and should still be reviewed by a qualified legal professional.
              </p>

              <div className="mt-4 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 py-4 bg-sage-light/40 border-b border-border">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Ask about this document</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe-green inline-block animate-pulse-gentle" />
                      Live backend chat via /doc_analyzer
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
                          className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
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

                  {chatMessages.length <= 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                      {DOCUMENT_SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => void sendChatMessage(q)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-primary/20 text-primary bg-sage-light/50 hover:bg-sage-light transition-colors active:scale-[0.97]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2 border-t border-border px-3 py-2 bg-card">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask anything about this document..."
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
            </div>
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
