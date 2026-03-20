import { useState, useCallback } from "react";
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
} from "lucide-react";

interface AnalysisResult {
  overallRisk: "low" | "medium" | "high";
  summary: string;
  flags: { type: "danger" | "warning" | "info"; text: string }[];
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

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const analyzeDocument = () => {
    setAnalyzing(true);
    // Simulated analysis
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setAnalyzing(false);
    }, 2500);
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
                  Drag & drop your document here, or click to browse
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
                    onClick={() => { setFile(null); setResult(null); }}
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
            </div>
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
