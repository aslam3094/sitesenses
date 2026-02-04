import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, Globe, MessageSquare, Sparkles, Shield, Zap, ArrowRight, Check, Bot, Users, BarChart3 } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Globe,
      title: "Add Website URLs",
      description: "Simply paste your website URL and we'll automatically crawl and index your content.",
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Upload PDFs, TXT, and Markdown files to expand your knowledge base.",
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Chat",
      description: "Your chatbot answers questions based only on your content—no hallucinations.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties.",
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
      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-30" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full gradient-accent-subtle border border-accent/20 px-4 py-2 text-sm font-medium text-accent mb-8 animate-fade-in shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Knowledge Base
              <span className="ml-1 px-2 py-0.5 rounded-full bg-accent/20 text-xs">New</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6 animate-fade-in-up">
              Turn your content into an{" "}
              <span className="text-gradient">intelligent chatbot</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1 leading-relaxed">
              Create a custom AI assistant that answers questions based only on your
              website and documents. No hallucinations, just accurate answers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="accent" className="px-8 h-12 text-base shadow-glow">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating elements decoration */}
          <div className="hidden lg:block absolute top-20 left-10 animate-bounce-subtle">
            <div className="w-12 h-12 rounded-xl gradient-accent-subtle border border-accent/20 flex items-center justify-center shadow-sm">
              <Bot className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-40 right-20 animate-bounce-subtle stagger-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shadow-sm">
              <Check className="h-5 w-5 text-success" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 rounded-xl bg-card/80 border border-border/50 shadow-xs animate-fade-in-up hover-lift"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
              <Zap className="h-3 w-3" />
              Simple Setup
            </div>
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get your AI chatbot up and running in minutes with our simple process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                className="border-border/50 shadow-soft card-premium animate-fade-in-up group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-accent-subtle border border-accent/20 mb-4 group-hover:shadow-glow transition-shadow duration-300">
                    <feature.icon className="h-7 w-7 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perfect for every team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From startups to enterprises, KnowledgeBot helps teams provide instant answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Customer Support", desc: "Deflect common questions and reduce ticket volume by up to 70%." },
              { icon: BarChart3, title: "Sales Teams", desc: "Give prospects instant answers about your product and pricing." },
              { icon: Brain, title: "Internal Knowledge", desc: "Help employees find information quickly across your organization." },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent mb-4 shadow-sm">
                  <item.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-accent mx-auto mb-8 shadow-glow">
              <Brain className="h-10 w-10 text-accent-foreground" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to build your AI knowledge base?
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg">
              Join thousands of businesses using KnowledgeBot to provide instant,
              accurate answers to their customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="accent" className="px-8 h-12 text-base">
                  Start for Free
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
