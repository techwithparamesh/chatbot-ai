import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out ChatBot AI",
    icon: Sparkles,
    color: "from-gray-500/20 to-gray-600/20",
    iconColor: "text-gray-500",
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
    icon: Zap,
    color: "from-primary/20 to-chart-3/20",
    iconColor: "text-primary",
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
    icon: Crown,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
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
  return (
    <section id="pricing" className="py-10 sm:py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chart-3/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-background/50 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
            Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-pricing-title">
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Choose the plan that fits your needs. No hidden fees, cancel anytime. Start free and scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group ${plan.popular ? "lg:-mt-4 lg:mb-4 md:col-span-2 lg:col-span-1" : ""}`}
            >
              <Card 
                className={`h-full flex flex-col overflow-visible transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? "border-primary shadow-lg shadow-primary/10 relative bg-gradient-to-b from-primary/5 to-transparent" 
                    : "hover:border-primary/30"
                }`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 bg-gradient-to-r from-primary to-chart-3 border-0 shadow-lg" data-testid="badge-most-popular">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <plan.icon className={`h-7 w-7 ${plan.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold" data-testid={`text-plan-${plan.name.toLowerCase()}-name`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-5xl font-bold" data-testid={`text-plan-${plan.name.toLowerCase()}-price`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground text-lg">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3" data-testid={`list-plan-${plan.name.toLowerCase()}-features`}>
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={feature} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.3 + featureIndex * 0.05 }}
                        className="flex items-start gap-3" 
                        data-testid={`text-plan-${plan.name.toLowerCase()}-feature-${featureIndex + 1}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-chart-2" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Link href="/signup" className="w-full">
                    <Button 
                      className={`w-full py-6 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25" 
                          : ""
                      } transition-all duration-300`}
                      variant={plan.popular ? "default" : "outline"}
                      data-testid={`button-plan-${plan.name.toLowerCase()}-cta`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            🔒 30-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
