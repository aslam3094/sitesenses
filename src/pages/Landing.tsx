import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Upload, Globe, MessageSquare, Shield, Zap, ArrowRight, Check, Users, BarChart3 } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";

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
    "Instant answers from your content",
    "No AI hallucinations",
    "Setup in minutes",
    "Works with any website",
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
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 md:py-20 border-y border-border bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding-sm">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-5 rounded-xl bg-card border border-border shadow-card animate-fade-in-up hover-lift"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
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
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-medium text-foreground mb-6">
              <Zap className="h-4 w-4 text-accent" />
              Simple Setup
            </div>
            <h2 className="mb-5 text-balance">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Get your AI chatbot up and running in minutes with our simple process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card border border-border shadow-card animate-fade-in-up transition-all duration-300 hover:shadow-lg hover:border-accent/20 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-5 group-hover:bg-accent/15 transition-colors">
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
            <h2 className="mb-5 text-balance">Perfect for every team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              From startups to enterprises, SiteSense helps teams provide instant answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Customer Support", desc: "Deflect common questions and reduce ticket volume by up to 70%." },
              { icon: BarChart3, title: "Sales Teams", desc: "Give prospects instant answers about your product and pricing." },
              { icon: Brain, title: "Internal Knowledge", desc: "Help employees find information quickly across your organization." },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-8 rounded-2xl bg-card border border-border shadow-card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent mx-auto mb-8 shadow-glow">
              <Brain className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-primary-foreground">
              Ready to build your AI knowledge base?
            </h2>
            <p className="text-primary-foreground/70 mb-10 max-w-lg mx-auto text-lg">
              Join thousands of businesses using SiteSense to provide instant,
              accurate answers to their customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="xl" variant="accent" className="min-w-[180px]">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="xl" variant="outline" className="min-w-[180px] border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30">
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
