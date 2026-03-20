import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Globe } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const location = useLocation();

  const links = [
    { path: "/", label: lang === "en" ? "Home" : "होम" },
    { path: "/chat", label: lang === "en" ? "Legal Help" : "कानूनी सहायता" },
    { path: "/analyze", label: lang === "en" ? "Document Check" : "दस्तावेज़ जाँच" },
    { path: "/rights", label: lang === "en" ? "Know Your Rights" : "अपने अधिकार जानें" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl text-foreground tracking-tight">
            ny.ai
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? "secondary" : "ghost"}
                size="sm"
                className="text-sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            title="Switch language"
          >
            <Globe className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background p-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === link.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
            >
              <Globe className="w-4 h-4" />
              {lang === "en" ? "हिंदी" : "English"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
