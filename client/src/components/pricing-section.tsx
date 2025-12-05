import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useModal } from "@/pages/home";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out ChatBot AI",
    features: [
      "1 chatbot",
      "1 website scan",
      "50 chats/month",
      "Basic customization",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Unlimited chatbots",
      "Unlimited scans",
      "Unlimited chats",
      "Branding removal",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom AI model",
      "API access",
      "Dedicated support",
      "SLA guarantee",
      "Custom training",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  const { openModal } = useModal();
  
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.popular ? "lg:-mt-4 lg:mb-4" : ""}
            >
              <Card 
                className={`h-full flex flex-col overflow-visible ${
                  plan.popular 
                    ? "border-primary shadow-lg relative" 
                    : ""
                }`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-4" data-testid="badge-most-popular">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <h3 className="text-xl font-semibold" data-testid={`text-plan-${plan.name.toLowerCase()}-name`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold" data-testid={`text-plan-${plan.name.toLowerCase()}-price`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3" data-testid={`list-plan-${plan.name.toLowerCase()}-features`}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={feature} className="flex items-start gap-3" data-testid={`text-plan-${plan.name.toLowerCase()}-feature-${featureIndex + 1}`}>
                        <Check className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`button-plan-${plan.name.toLowerCase()}-cta`}
                    onClick={() => openModal(plan.name === "Enterprise" ? "demo" : "signup")}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
