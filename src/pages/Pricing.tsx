import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, MessageSquare, Building2 } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      color: "bg-emerald-500",
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
      color: "bg-blue-500",
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
      color: "bg-amber-500",
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
      color: "bg-rose-500",
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
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial with no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-accent"
            />
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={plan.name}
              className={`relative border-border/50 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 animate-slide-up flex flex-col ${
                plan.popular ? "border-accent border-2 lg:scale-105" : ""
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                <div className="mt-4">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className="text-4xl font-bold">
                        ${isAnnual ? plan.monthlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">/mo</span>
                      {isAnnual && (
                        <p className="text-xs text-muted-foreground mt-1">
                          billed ${plan.annualPrice} yearly
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">Custom</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact for pricing
                      </p>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link to={plan.monthlyPrice !== null ? "/auth?mode=signup" : "#"} className="block">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "gradient-accent text-accent-foreground border-0 hover:opacity-90"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular && <Zap className="mr-2 h-4 w-4" />}
                      {plan.monthlyPrice === null && <Building2 className="mr-2 h-4 w-4" />}
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ / Additional Info */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What counts as a message?</h3>
              <p className="text-sm text-muted-foreground">
                A message is any interaction between a user and your chatbot. Both user questions and bot responses count as separate messages.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What are pages?</h3>
              <p className="text-sm text-muted-foreground">
                Pages refer to the amount of content you can add to your knowledge base. This includes website pages, documents, and other content sources.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
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
