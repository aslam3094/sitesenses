import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Upload, Globe, MessageSquare, Shield, Zap, ArrowRight, Check, Bot, Users, BarChart3, Sparkles } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BlurFade } from "@/components/ui/blur-fade";

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
      {/* Hero Section with Container Scroll */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            {/* Badge */}
            <BlurFade delay={0}>
              <div 
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground mb-8 shadow-soft"
              >
                <Sparkles className="h-4 w-4 text-accent" />
                <span>AI-Powered Customer Support</span>
              </div>
            </BlurFade>
            
            {/* Main Heading */}
            <BlurFade delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight text-center">
                Turn your website into an{" "}
                <span className="text-gradient">intelligent AI agent</span>
              </h1>
            </BlurFade>
            
            {/* Description */}
            <BlurFade delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-balance text-center">
                SiteSense turns your documentation and knowledge sources into an intelligent AI agent that intercepts and resolves customer queries automatically. Only the complex issues that truly require human touch reach your support team.
              </p>
            </BlurFade>

            {/* Secondary Description */}
            <BlurFade delay={0.3}>
              <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-center">
                It's like having ChatGPT specifically for your products. Instantly answer your visitors' questions with a personalized chatbot trained on your website content.
              </p>
            </BlurFade>
            
            {/* CTA Buttons */}
            <BlurFade delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="xl" variant="accent" className="min-w-[180px]">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="xl" variant="outline" className="min-w-[180px]">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </BlurFade>
          </div>
        }
      >
        {/* Dashboard Preview inside scroll container */}
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-accent/5 via-background to-muted/30 rounded-2xl p-8">
          <div className="w-full max-w-4xl">
            {/* Mock Chat Interface */}
            <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
                  <Bot className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">SiteSense AI</h3>
                  <p className="text-xs text-muted-foreground">Trained on your knowledge base</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-6 space-y-4 min-h-[280px]">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm">How do I integrate the chatbot with my website?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-accent text-accent-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm">Great question! You can integrate SiteSense with just a single line of code. Simply copy the embed script from your dashboard and paste it before the closing &lt;/body&gt; tag on your website. The chatbot will automatically appear as a floating widget.</p>
                  </div>
                  <div className="h-8 w-8 rounded-full gradient-accent flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm">Can I customize the appearance?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-accent text-accent-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm">Absolutely! You can customize colors, position, welcome messages, and more from the Settings page. Match it perfectly with your brand. ✨</p>
                  </div>
                  <div className="h-8 w-8 rounded-full gradient-accent flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="px-6 py-4 border-t border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Ask anything about your product..." 
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                    disabled
                  />
                  <Button size="sm" variant="accent" className="px-4">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>

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
