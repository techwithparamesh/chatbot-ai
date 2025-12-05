import { Card, CardContent } from "@/components/ui/card";
import { Globe, Brain, Code, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: 1,
    title: "Enter Your Website URL",
    description: "We automatically scan all your pages, services, blogs, and FAQs.",
    icon: Globe,
    color: "from-primary to-chart-1",
  },
  {
    step: 2,
    title: "Train Your Chatbot",
    description: "Your website content becomes knowledge. Add PDFs or documents for extra training.",
    icon: Brain,
    color: "from-chart-3 to-chart-5",
  },
  {
    step: 3,
    title: "Embed & Go Live",
    description: "Copy a single script and instantly activate your chatbot on any website.",
    icon: Code,
    color: "from-chart-2 to-chart-4",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="text-how-it-works-title">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your AI chatbot up and running in just three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10"
            >
              <Card className="h-full text-center p-8 hover-elevate transition-all duration-300" data-testid={`card-step-${item.step}`}>
                <CardContent className="p-0">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4" data-testid={`badge-step-${item.step}-number`}>
                    {item.step}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3" data-testid={`text-step-${item.step}-title`}>
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-${item.step}-description`}>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
