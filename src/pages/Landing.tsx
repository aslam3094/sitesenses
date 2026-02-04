import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Upload, Globe, MessageSquare, Shield, Zap, ArrowRight, Check, Bot, Users, BarChart3 } from "lucide-react";

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

  const benefits = [
    "Answers based only on your content",
    "No AI hallucinations or made-up facts",
    "Instant setup in minutes",
    "Works with any website or document",
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "1M+", label: "Questions Answered" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        {/* Background - subtle, refined */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge - subtle, refined */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 text-sm font-medium text-accent-foreground/80 mb-10 animate-fade-in">
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span>AI-Powered Knowledge Base</span>
            </div>
            
            <h1 className="mb-6 animate-fade-in-up">
              Turn your content into an{" "}
              <span className="text-gradient">intelligent chatbot</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-1 leading-relaxed">
              Create a custom AI assistant that answers questions based only on your
              website and documents. No hallucinations, just accurate answers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
              <Link to="/auth?mode=signup">
                <Button size="xl" variant="accent">
                  Get Started Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="xl" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating decorations - subtle */}
          <div className="hidden lg:block absolute top-24 left-16 animate-float">
            <div className="w-12 h-12 rounded-xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-48 right-20 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 rounded-lg bg-success/[0.08] border border-success/10 flex items-center justify-center">
              <Check className="h-4 w-4 text-success" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/60 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding-sm bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border/60 shadow-card animate-fade-in-up hover-lift"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="container">
          <div className="text-center mb-16 md:mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/[0.06] border border-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground/80 mb-6">
              <Zap className="h-3 w-3 text-accent" />
              Simple Setup
            </div>
            <h2 className="mb-5">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Get your AI chatbot up and running in minutes with our simple process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card border border-border/60 shadow-card animate-fade-in-up transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/[0.08] border border-accent/10 mb-5 group-hover:bg-accent/[0.12] transition-colors">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="mb-5">Perfect for every team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              From startups to enterprises, KnowledgeBot helps teams provide instant answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "Customer Support", desc: "Deflect common questions and reduce ticket volume by up to 70%." },
              { icon: BarChart3, title: "Sales Teams", desc: "Give prospects instant answers about your product and pricing." },
              { icon: Brain, title: "Internal Knowledge", desc: "Help employees find information quickly across your organization." },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-8 rounded-2xl bg-card border border-border/60 shadow-card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent mb-6">
                  <item.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.04),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent mx-auto mb-8 shadow-glow">
              <Brain className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-primary-foreground">
              Ready to build your AI knowledge base?
            </h2>
            <p className="text-primary-foreground/70 mb-10 max-w-lg mx-auto text-lg">
              Join thousands of businesses using KnowledgeBot to provide instant,
              accurate answers to their customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="xl" variant="accent">
                  Start for Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="xl" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30">
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
