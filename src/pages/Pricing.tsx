import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, MessageSquare, Building2, ArrowRight } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 39,
      annualPrice: 468,
      description: "Perfect for small businesses getting started",
      features: [
        "1 chatbot",
        "Up to 4,000 messages / month",
        "Up to 1,000 pages",
        "Manual Refresh",
        "1 member",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Growth",
      monthlyPrice: 79,
      annualPrice: 948,
      description: "For growing teams that need more power",
      features: [
        "Up to 2 chatbots",
        "Up to 10,000 messages / month",
        "Up to 10,000 pages",
        "Manual Refresh",
        "Up to 4 team members",
        "Integrations with multiple platforms",
        "API Access",
        "Rate Limiting",
        "Auto Refresh (Monthly)",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Scale",
      monthlyPrice: 259,
      annualPrice: 3108,
      description: "For businesses that need advanced features",
      features: [
        "Up to 3 chatbots",
        "Up to 40,000 messages / month",
        "Up to 50,000 pages",
        "Manual Refresh",
        "Up to 10 team members",
        "Integrations with multiple platforms",
        "API Access",
        "Rate Limiting",
        "Auto Refresh (Weekly)",
        "Auto Scan (Daily)",
        "Webhook Support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Enterprise",
      monthlyPrice: null,
      annualPrice: null,
      description: "Custom solutions for large organizations",
      features: [
        "Up to 10,000 chatbots",
        "Customizable message volume",
        "Up to 500,000 pages",
        "Manual Refresh",
        "Up to 10,000 team members",
        "Integrations with multiple platforms",
        "API Access",
        "Rate Limiting",
        "Auto Refresh (Daily)",
        "Webhook Support",
        "Priority Support",
        "Custom Integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto animate-fade-in">
          <h1 className="mb-5">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial with no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-accent"
            />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-6 flex flex-col animate-fade-in-up transition-all duration-300 hover:-translate-y-1 ${
                plan.popular 
                  ? "border-accent shadow-glow lg:scale-[1.02]" 
                  : "border-border/60 shadow-card hover:shadow-lg hover:border-border"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Plan header */}
              <div className="text-center pb-6 border-b border-border/60">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{plan.description}</p>
                
                <div>
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className="text-4xl font-bold">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">/mo</span>
                      {isAnnual && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          billed ${plan.annualPrice} yearly
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">Custom</span>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Contact for pricing
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="flex-1 py-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* CTA */}
              <div className="pt-4">
                <Link to={plan.monthlyPrice !== null ? "/auth?mode=signup" : "#"} className="block">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "gradient-accent text-accent-foreground"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.popular && <Zap className="mr-1.5 h-4 w-4" />}
                    {plan.monthlyPrice === null && <Building2 className="mr-1.5 h-4 w-4" />}
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 md:mt-32 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What counts as a message?",
                a: "A message is any interaction between a user and your chatbot. Both user questions and bot responses count as separate messages."
              },
              {
                q: "What are pages?",
                a: "Pages refer to the amount of content you can add to your knowledge base. This includes website pages, documents, and other content sources."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required to start."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl bg-card border border-border/60 shadow-card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-5">
            Need help choosing the right plan? Pricing excludes applicable taxes.
          </p>
          <Button variant="outline" size="lg">
            <MessageSquare className="mr-2 h-4 w-4" />
            Talk to Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
