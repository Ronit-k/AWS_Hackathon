import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Globe } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const location = useLocation();

  useEffect(() => {
    const initTranslate = () => {
      const gtElement = document.getElementById("google_translate_element");
      if (gtElement && gtElement.innerHTML.length === 0) {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,hi", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = initTranslate;
    } else {
      if ((window as any).google && (window as any).google.translate) {
        initTranslate();
      } else {
        (window as any).googleTranslateElementInit = initTranslate;
      }
    }
  }, []);

  const toggleLanguage = () => {
    const targetLang = lang === "en" ? "hi" : "en";
    setLang(targetLang);

    const gtSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (gtSelect) {
      gtSelect.value = targetLang;
      gtSelect.dispatchEvent(new Event("change"));
    }
  };

  const links = [
    { path: "/", label: "Home" },
    { path: "/chat", label: "Legal Help" },
    { path: "/analyze", label: "Document Check" },
    { path: "/rights", label: "Know Your Rights" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl text-foreground tracking-tight notranslate mx-1">
            ny.ai
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 mr-2">
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
          </div>

          {/* Hidden Google Translate Element */}
          <div id="google_translate_element" className="opacity-0 w-0 h-0 overflow-hidden absolute pointer-events-none"></div>

          {/* Custom Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="notranslate hidden md:flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "हिंदी" : "English"}
          </Button>

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
              variant="outline"
              className="w-full justify-start gap-2 notranslate mt-2"
              onClick={toggleLanguage}
            >
              <Globe className="w-4 h-4" />
              {lang === "en" ? "Translate to हिंदी" : "Translate to English"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
