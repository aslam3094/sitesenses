import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, Globe, MessageSquare, Sparkles, Shield, Zap, ArrowRight, Check } from "lucide-react";

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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Knowledge Base
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Turn your content into an{" "}
              <span className="text-accent">intelligent chatbot</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create a custom AI assistant that answers questions based only on your
              website and documents. No hallucinations, just accurate answers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-accent text-accent-foreground border-0 hover:opacity-90 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your AI chatbot up and running in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border-border/50 shadow-soft hover:shadow-elevated transition-shadow animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent mx-auto mb-6">
              <Brain className="h-8 w-8 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to build your AI knowledge base?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of businesses using KnowledgeBot to provide instant,
              accurate answers to their customers.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="secondary" className="px-8">
                Start for Free
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
