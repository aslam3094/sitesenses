import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput = ({ onSend, disabled, loading }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your content..."
        disabled={disabled || loading}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={disabled || loading || !input.trim()}
        className="gradient-accent text-accent-foreground border-0 hover:opacity-90"
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
