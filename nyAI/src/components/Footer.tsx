import { Shield, Lock, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display text-lg notranslate mx-1">ny.ai</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Safe, anonymous, and empathetic legal assistance for everyone in India.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Privacy Promise</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Lock className="w-3 h-3" /> No personal data collected</li>
            <li className="flex items-center gap-2"><Lock className="w-3 h-3" /> End-to-end encrypted sessions</li>
            <li className="flex items-center gap-2"><Lock className="w-3 h-3" /> Anonymous by default</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Emergency</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Women Helpline: <strong className="text-foreground">181</strong></li>
            <li>Police: <strong className="text-foreground">100</strong></li>
            <li>Legal Aid: <strong className="text-foreground">15100</strong></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 <span className="notranslate mx-1">ny.ai</span> — Nyaay AI.</p>
        <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-destructive" /> for India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
