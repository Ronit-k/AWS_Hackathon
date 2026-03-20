import { useState } from "react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  Home,
  Briefcase,
  Scale,
  ChevronDown,
  ChevronUp,
  Phone,
  Shield,
} from "lucide-react";

const CATEGORIES = [
  {
    icon: Heart,
    title: "Women's Safety",
    color: "text-destructive",
    guides: [
      {
        title: "Protection of Women from Domestic Violence Act, 2005",
        content:
          "You have the right to live free from violence in your home. This includes physical, emotional, verbal, economic, and sexual abuse. You can get a protection order from a magistrate, claim residence rights in the shared household (even if it's not in your name), request monetary relief, and get custody of children. You do NOT need to file a police complaint to get protection — you can approach a Protection Officer or NGO directly.",
      },
      {
        title: "Workplace Sexual Harassment (POSH Act)",
        content:
          "Every workplace with 10+ employees must have an Internal Complaints Committee (ICC). You can file a complaint within 3 months of the incident (extendable in some cases). The employer cannot terminate or transfer you as retaliation. If your workplace doesn't have an ICC, you can approach the Local Complaints Committee set up by the District Officer.",
      },
      {
        title: "Filing an FIR — Your Right",
        content:
          "Police MUST register your FIR — they cannot refuse. If they do refuse, you can approach the Superintendent of Police or a Magistrate under Section 156(3) CrPC. You have the right to a free copy of the FIR. For sensitive cases, a woman officer should record your statement. You can also file a Zero FIR at any police station regardless of jurisdiction.",
      },
    ],
  },
  {
    icon: Home,
    title: "Tenant & Housing Rights",
    color: "text-primary",
    guides: [
      {
        title: "Protection Against Illegal Eviction",
        content:
          "Your landlord cannot evict you without proper legal notice (typically 15-30 days depending on state law). They cannot cut off water, electricity, or lock you out — this is illegal. Even without a written agreement, if you can prove you've been paying rent, you have tenant rights. Rent increases must follow state rent control laws where applicable.",
      },
      {
        title: "Security Deposit Rights",
        content:
          "Your landlord must return your security deposit when you vacate, minus legitimate deductions for damages (normal wear and tear doesn't count). Most states limit deposits to 1-3 months' rent. If they refuse, you can send a legal notice and approach the civil court or rent tribunal.",
      },
    ],
  },
  {
    icon: Briefcase,
    title: "Worker & Employee Rights",
    color: "text-trust",
    guides: [
      {
        title: "Right to Timely Wages",
        content:
          "Under the Payment of Wages Act, your employer must pay you within 7 days of the wage period (10 days for 1000+ employees). Unauthorized deductions beyond those permitted by law are illegal. If your wages are withheld, you can file a complaint with the Labour Commissioner — the process is free and doesn't require a lawyer.",
      },
      {
        title: "Termination Protections",
        content:
          "Employees who have worked for 240+ days are entitled to at least 1 month's notice or pay in lieu. Retrenchment compensation is 15 days' average pay for every completed year of service. You cannot be terminated for union membership, filing a complaint, or being pregnant (Maternity Benefit Act protects you for 26 weeks).",
      },
    ],
  },
  {
    icon: Scale,
    title: "Consumer Rights",
    color: "text-hope",
    guides: [
      {
        title: "Consumer Protection Act, 2019",
        content:
          "You are protected against unfair trade practices, defective goods, and deficient services. You can file complaints online through the e-Daakhil portal (edaakhil.nic.in). District Commissions handle claims up to ₹1 crore, State Commissions up to ₹10 crore. No lawyer is needed — you can argue your own case. Product liability now covers manufacturers, sellers, and service providers.",
      },
      {
        title: "Loan & Banking Rights",
        content:
          "Banks cannot charge hidden fees without disclosure. Prepayment penalties on floating-rate home loans are banned by RBI. If you're a loan guarantor, the bank must exhaust remedies against the borrower first (in most cases). You can approach the Banking Ombudsman for free resolution of complaints against banks.",
      },
    ],
  },
];

const Rights = () => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  return (
    <Layout>
      <div className="container max-w-3xl py-10 md:py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Know Your Rights
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple, clear explanations of your legal protections under Indian law. No jargon — just the facts you need.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {CATEGORIES.map((cat, catIdx) => (
            <ScrollReveal key={cat.title} delay={catIdx * 80}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                  <h2 className="font-display text-xl text-foreground">{cat.title}</h2>
                </div>
                <div className="space-y-3">
                  {cat.guides.map((guide) => {
                    const key = `${cat.title}-${guide.title}`;
                    const isOpen = expandedGuide === key;
                    return (
                      <div
                        key={key}
                        className="bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                      >
                        <button
                          onClick={() => setExpandedGuide(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left active:scale-[0.995] transition-transform"
                        >
                          <span className="text-sm font-medium text-foreground pr-4">
                            {guide.title}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 animate-fade-in">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {guide.content}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={400}>
          <div className="mt-14 bg-sage-light rounded-2xl p-6 md:p-8 text-center">
            <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-display text-lg text-foreground mb-2">
              Need personalized help?
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Our AI chatbot can answer specific questions about your situation — privately and anonymously.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="/chat">
                <Button variant="hero" className="gap-2">
                  Ask a Legal Question
                </Button>
              </a>
              <a href="tel:15100">
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Free Legal Aid: 15100
                </Button>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
};

export default Rights;
