import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput = ({ onSend, disabled, loading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className={`flex-1 relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask a question about your content..."
          disabled={disabled || loading}
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-300 input-glow
            ${isFocused 
              ? 'border-accent/50 shadow-sm' 
              : 'border-input hover:border-accent/30'
            }
            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      </div>
      <Button
        type="submit"
        disabled={disabled || loading || !input.trim()}
        variant="accent"
        size="icon"
        className="h-11 w-11 shrink-0"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
