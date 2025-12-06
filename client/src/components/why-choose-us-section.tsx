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
    <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4" data-testid="text-why-choose-us-title">
            Why Choose Us
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses using ChatBot AI to automate customer support
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full text-center hover-elevate transition-all duration-300" data-testid={`card-benefit-${index + 1}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-chart-3/10 flex items-center justify-center mb-3 sm:mb-4">
                    <benefit.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2" data-testid={`text-benefit-${index + 1}-title`}>
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none" data-testid={`text-benefit-${index + 1}-description`}>
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
