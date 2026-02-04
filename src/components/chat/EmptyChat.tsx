import { Bot, Zap, Shield, MessageSquare } from "lucide-react";

export const EmptyChat = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mx-auto mb-4">
          <Bot className="h-8 w-8 text-accent" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Your Knowledge Assistant</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Ask questions and get instant answers based on your website content and documentation.
        </p>
        
        <div className="grid grid-cols-1 gap-3 text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Zap className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Instant Answers</p>
              <p className="text-xs text-muted-foreground">Get quick responses from your knowledge base</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Accurate & Grounded</p>
              <p className="text-xs text-muted-foreground">Answers strictly based on your content only</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <MessageSquare className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Conversational</p>
              <p className="text-xs text-muted-foreground">Natural dialogue with context awareness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
