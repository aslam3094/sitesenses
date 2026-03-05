import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Upload, Globe, MessageSquare, Shield, Zap, ArrowRight, Users, BarChart3 } from "lucide-react";
import { GLSLHills } from "@/components/ui/glsl-hills";

const Landing = () => {
  const features = [
    {
      icon: Globe,
      title: "Add Website URLs",
      description: "Simply paste your website URL and we'll automatically crawl and index your content for instant retrieval.",
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Upload PDFs, TXT, and Markdown files to expand your knowledge base with rich document support.",
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Chat",
      description: "Your chatbot answers questions based only on your content—accurate answers, no hallucinations.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade encryption ensures your data stays private and is never shared with third parties.",
    },
  ];



  return (
    <div className="flex flex-col relative">
      {/* Hero Section with GLSL Hills */}
      <section className="relative h-[calc(100vh-3.5rem)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        <GLSLHills />
        <div className="space-y-6 pointer-events-none z-10 text-center absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-semibold text-7xl whitespace-pre-wrap text-white">
            <span className="italic text-6xl font-thin">AI That Speaks <br /></span>
            Louder Than Words
          </h1>
          <p className="text-sm text-white/60 max-w-lg">
            Train your AI chatbot on your website and documents. Provide instant, accurate answers to your customers 24/7.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto pt-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="min-w-[160px]">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="min-w-[160px] border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Consistent with hero theme */}
      <section id="features" className="py-16 md:py-20 relative z-10 bg-foreground">
        <div className="container">
          <div className="text-center mb-10 md:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/30 px-4 py-1.5 text-sm font-medium text-background/90 mb-6">
              <Zap className="h-4 w-4 text-accent" />
              Simple Setup
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-background text-balance">How it works</h2>
            <p className="text-background/70 max-w-xl mx-auto text-lg">
              Get your AI chatbot up and running in minutes with our simple process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-5 rounded-2xl bg-background/5 border border-background/10 backdrop-blur-sm animate-fade-in-up transition-all duration-300 hover:bg-background/10 hover:border-background/20"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 border border-accent/30 mb-4 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">{feature.title}</h3>
                <p className="text-background/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-14 md:py-16 relative z-10 bg-background/90 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">Perfect for every team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              From startups to enterprises, SiteSense helps teams provide instant answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Customer Support", desc: "Deflect common questions and reduce ticket volume by up to 70%." },
              { icon: BarChart3, title: "Sales Teams", desc: "Give prospects instant answers about your product and pricing." },
              { icon: Brain, title: "Internal Knowledge", desc: "Help employees find information quickly across your organization." },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-card/90 border border-border shadow-card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-accent mb-5">
                  <item.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-foreground text-primary-foreground relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent mx-auto mb-6 shadow-glow">
              <Brain className="h-6 w-6 text-accent-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-background">
              Ready to build your AI knowledge base?
            </h2>
            <p className="text-background/60 mb-8 max-w-lg mx-auto text-base">
              Join thousands of businesses using SiteSense to provide instant,
              accurate answers to their customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="accent" className="min-w-[160px]">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="min-w-[160px] border-background/40 text-background bg-background/10 hover:bg-background/20 hover:border-background/50">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
