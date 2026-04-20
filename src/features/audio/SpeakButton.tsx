import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTS } from "@/features/audio/useTTS";
import { cn } from "@/lib/utils";

interface SpeakButtonProps {
  text: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  label?: string;
  className?: string;
}

export function SpeakButton({ text, size = "icon", variant = "ghost", label, className }: SpeakButtonProps) {
  const { speak, supported } = useTTS();
  if (!supported) return null;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("text-primary hover:text-primary", className)}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={label ?? "Ouvir em inglês"}
    >
      <Volume2 className="h-4 w-4" />
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
