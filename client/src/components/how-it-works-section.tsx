import { Card, CardContent } from "@/components/ui/card";
import { Globe, Brain, Code, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const steps = [
  {
    step: 1,
    title: "Enter Your Website URL",
    description: "We automatically scan all your pages, services, blogs, and FAQs.",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    features: ["Automatic page detection", "Content extraction", "Smart categorization"],
  },
  {
    step: 2,
    title: "Train Your Chatbot",
    description: "Your website content becomes knowledge. Add PDFs or documents for extra training.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/10 to-pink-500/10",
    features: ["AI-powered learning", "Custom personality", "Multi-language support"],
  },
  {
    step: 3,
    title: "Embed & Go Live",
    description: "Copy a single script and instantly activate your chatbot on any website.",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-500/10 to-emerald-500/10",
    features: ["One-click embed", "Instant activation", "Real-time analytics"],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-10 sm:py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
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
            Simple Process
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-how-it-works-title">
            How It{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Get your AI chatbot up and running in just three simple steps. No coding required, no technical skills needed.
          </p>
        </motion.div>

        {/* Progress Line */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[280px] w-[calc(100%-200px)] max-w-4xl h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full opacity-20" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative z-10 group"
            >
              <Card 
                className={`h-full text-center p-4 sm:p-6 lg:p-8 border-border/50 hover:border-primary/30 transition-all duration-500 overflow-hidden relative bg-gradient-to-br ${item.bgColor} hover:shadow-xl`} 
                data-testid={`card-step-${item.step}`}
              >
                <CardContent className="p-0 relative z-10">
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-background border-2 border-border flex items-center justify-center font-bold text-sm sm:text-lg text-primary shadow-lg group-hover:scale-110 transition-transform duration-300" data-testid={`badge-step-${item.step}-number`}>
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-16 lg:w-20 sm:h-16 lg:h-20 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <item.icon className="h-6 w-6 sm:h-8 lg:h-10 sm:w-8 lg:w-10 text-white" />
                  </div>
                  
                  <h3 className="text-sm sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-3 group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-step-${item.step}-title`}>
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mb-0 sm:mb-6 line-clamp-2 sm:line-clamp-none" data-testid={`text-step-${item.step}-description`}>
                    {item.description}
                  </p>
                  
                  {/* Feature List - Hidden on mobile */}
                  <ul className="hidden sm:block space-y-2 text-left">
                    {item.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.3 + featureIndex * 0.1 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-chart-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Arrow between cards */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                    className="w-8 h-8 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg"
                  >
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8 sm:mt-12"
        >
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Building Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
