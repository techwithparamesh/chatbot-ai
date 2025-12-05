import { Card, CardContent } from "@/components/ui/card";
import { Code2, Globe2, Sparkles, Clock } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "No Coding Required",
    description: "Build powerful AI chatbots without writing a single line of code",
    icon: Code2,
  },
  {
    title: "Works on Any Website",
    description: "Compatible with HTML, WordPress, Shopify, Webflow, and more",
    icon: Globe2,
  },
  {
    title: "AI-Powered Accuracy",
    description: "Advanced RAG technology ensures precise, relevant responses",
    icon: Sparkles,
  },
  {
    title: "Saves Time & Boosts Conversions",
    description: "Reduce support tickets and convert more visitors into customers",
    icon: Clock,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="text-why-choose-us-title">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses using ChatBot AI to automate customer support
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full text-center hover-elevate transition-all duration-300" data-testid={`card-benefit-${index + 1}`}>
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-chart-3/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-benefit-${index + 1}-title`}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-benefit-${index + 1}-description`}>
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
