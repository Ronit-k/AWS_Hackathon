import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const QuickExitButton = () => {
  const handleExit = () => {
    // Replace current page with a safe website
    window.location.replace("https://www.google.com");
    // Also try to clear history
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "https://www.google.com");
    }
  };

  return (
    <Button
      variant="quick-exit"
      size="xs"
      onClick={handleExit}
      className="quick-exit px-3 py-1.5"
      aria-label="Quickly leave this site"
      title="Leave this site quickly"
    >
      <X className="w-3 h-3" />
      Quick Exit
    </Button>
  );
};

export default QuickExitButton;
