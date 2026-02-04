import { Bot, Zap, Shield, MessageSquare, Sparkles } from "lucide-react";

export const EmptyChat = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md px-4 animate-fade-in-up">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-accent mx-auto shadow-glow">
            <Bot className="h-10 w-10 text-accent-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md border border-border">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
        </div>
        <h3 className="font-semibold text-xl mb-2">Your Knowledge Assistant</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Ask questions and get instant, accurate answers based on your website content and documentation.
        </p>
        
        <div className="grid grid-cols-1 gap-3 text-left">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/40 border border-border/50 hover-lift cursor-default">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent-subtle shrink-0">
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Instant Answers</p>
              <p className="text-xs text-muted-foreground mt-0.5">Get quick responses from your knowledge base</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/40 border border-border/50 hover-lift cursor-default">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent-subtle shrink-0">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Accurate & Grounded</p>
              <p className="text-xs text-muted-foreground mt-0.5">Answers strictly based on your content only</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/40 border border-border/50 hover-lift cursor-default">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent-subtle shrink-0">
              <MessageSquare className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Conversational</p>
              <p className="text-xs text-muted-foreground mt-0.5">Natural dialogue with context awareness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
