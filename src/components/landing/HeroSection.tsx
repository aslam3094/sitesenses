"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const labels = [
  { icon: Sparkles, label: "AI-Powered Answers" },
  { icon: Globe, label: "Website Trained" },
  { icon: Shield, label: "Enterprise Secure" },
];

const features = [
  {
    icon: MessageSquare,
    label: "Intelligent Chat",
    description: "Answer customer questions instantly with AI trained on your content.",
  },
  {
    icon: Upload,
    label: "Easy Integration",
    description: "Upload docs or paste URLs. Get a chatbot ready in minutes.",
  },
  {
    icon: Bot,
    label: "24/7 Support",
    description: "Never miss a customer query. AI handles it around the clock.",
  },
];

export function HeroSection() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = [
    "TURN",
    "YOUR",
    "WEBSITE",
    "INTO",
    "AN",
    "INTELLIGENT",
    "AI",
    "AGENT",
  ];

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-foreground">
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="rgb(245, 158, 11)"
        maxOpacity={0.15}
        flickerChance={0.1}
      />
      
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-accent/30 z-[1]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-[1]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 z-[1]" />

      <div className="relative z-[2] container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Animated Title */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.215, 0.61, 0.355, 1],
                      },
                    },
                  }}
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${
                    text === "INTELLIGENT" || text === "AI" || text === "AGENT"
                      ? "text-accent"
                      : "text-background"
                  }`}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.6, duration: 0.6 },
                },
              }}
              className="text-lg md:text-xl text-background/70 max-w-3xl mx-auto text-center mb-10 leading-relaxed"
            >
              SiteSense transforms your documentation and knowledge sources into an intelligent AI agent 
              that intercepts and resolves customer queries automatically. Only complex issues reach your support team.
            </motion.p>

            {/* Feature Labels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.8, duration: 0.6 },
                },
              }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {labels.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20 backdrop-blur-sm"
                >
                  <feature.icon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-background/90">
                    {feature.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 1, duration: 0.6 },
                },
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth?mode=signup">
                <Button
                  size="lg"
                  className="min-w-[200px] h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 rounded-full group"
                >
                  GET STARTED FREE
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] h-12 text-base font-semibold border-background/40 text-background bg-background/10 hover:bg-background/20 hover:border-background/60 rounded-full"
                >
                  VIEW PRICING
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 1.2, duration: 0.8 },
            },
          }}
          className="pb-16 lg:pb-24"
        >
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 1.4 + index * 0.15,
                      duration: 0.6,
                    },
                  },
                }}
                className="group p-6 rounded-2xl bg-background/5 border border-background/10 backdrop-blur-sm hover:bg-background/10 hover:border-background/20 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 border border-accent/30 mb-5 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h4 className="text-lg font-semibold text-background mb-2">
                  {feature.label}
                </h4>
                <p className="text-background/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
