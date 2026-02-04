import { Bot, Zap, Shield, MessageSquare, Sparkles } from "lucide-react";

export const EmptyChat = () => {
  return (
    <div className="h-full flex items-center justify-center py-8">
      <div className="text-center max-w-sm px-4 animate-fade-in-up">
        <div className="relative mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent mx-auto shadow-glow">
            <Bot className="h-7 w-7 text-accent-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm border border-border/60">
            <Sparkles className="h-3 w-3 text-accent" />
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2">Your Knowledge Assistant</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Ask questions and get instant, accurate answers based on your content.
        </p>
        
        <div className="space-y-2.5 text-left">
          {[
            { icon: Zap, title: "Instant Answers", desc: "Get quick responses from your knowledge base" },
            { icon: Shield, title: "Accurate & Grounded", desc: "Answers strictly based on your content" },
            { icon: MessageSquare, title: "Conversational", desc: "Natural dialogue with context awareness" },
          ].map((item, i) => (
            <div 
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/40"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                <item.icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
