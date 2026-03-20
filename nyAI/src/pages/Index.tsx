import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import {
  MessageCircle,
  FileSearch,
  BookOpen,
  Shield,
  Lock,
  Eye,
  UserX,
  Phone,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-light/40 to-transparent pointer-events-none" />
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-light border border-primary/10 text-sm text-primary font-medium mb-6">
                <Lock className="w-3.5 h-3.5" />
                100% Anonymous & Private
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground leading-[1.1] mb-6">
                Your rights deserve
                <br />
                a safe space
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
                Free, confidential legal guidance powered by AI. Understand your rights,
                analyze documents, and find help — no judgment, no data stored.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={240}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/chat">
                  <Button variant="hero" size="lg" className="gap-2 min-w-[200px]">
                    <MessageCircle className="w-5 h-5" />
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/analyze">
                  <Button variant="outline" size="lg" className="gap-2 min-w-[200px]">
                    <FileSearch className="w-5 h-5" />
                    Check a Document
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-16 border-y border-border/50 bg-card/30">
        <div className="container">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: Lock, label: "No data stored", desc: "Sessions vanish after close" },
                { icon: UserX, label: "Fully anonymous", desc: "No login required" },
                { icon: Eye, label: "No tracking", desc: "Zero cookies or analytics" },
                { icon: Shield, label: "Encrypted", desc: "End-to-end protection" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                How ny.ai helps you
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Simple, safe tools designed for real people facing real challenges.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Legal Chatbot",
                desc: "Ask any legal question in plain language. Get clear answers about your rights under Indian law — IPC, Constitution, domestic violence laws, and more.",
                link: "/chat",
                cta: "Start a conversation",
              },
              {
                icon: FileSearch,
                title: "Document Analysis",
                desc: "Upload contracts, loan papers, or agreements. Our AI highlights risky clauses, unfair terms, hidden charges, and legal red flags.",
                link: "/analyze",
                cta: "Analyze a document",
              },
              {
                icon: BookOpen,
                title: "Know Your Rights",
                desc: "Simple, illustrated guides on your legal protections — from workplace rights to tenant protections to women's safety laws.",
                link: "/rights",
                cta: "Browse guides",
              },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 100}>
                <div className="group bg-card rounded-2xl border border-border/60 p-6 md:p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{feature.desc}</p>
                  <Link to={feature.link}>
                    <Button variant="ghost" size="sm" className="gap-1 px-0 text-primary hover:text-primary/80">
                      {feature.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="py-16 bg-card/50 border-y border-border/50">
        <div className="container">
          <ScrollReveal>
            <div className="bg-destructive/5 border border-destructive/15 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-center">
              <Phone className="w-8 h-8 text-destructive mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">
                In immediate danger?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you or someone you know is in immediate danger, please call these emergency numbers.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "Women Helpline", number: "181" },
                  { label: "Police", number: "100" },
                  { label: "Legal Aid", number: "15100" },
                ].map((item) => (
                  <a key={item.number} href={`tel:${item.number}`}>
                    <Button variant="emergency" size="sm" className="gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      {item.label}: {item.number}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
