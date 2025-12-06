import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Bot, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const benefits = [
  { icon: Bot, text: "AI-powered responses" },
  { icon: Zap, text: "Setup in 2 minutes" },
  { icon: Shield, text: "Enterprise-grade security" },
];

export function CTASection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-3/10 dark:from-primary/15 dark:via-background dark:to-chart-3/15" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-3/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-chart-3/20 mb-4 sm:mb-6 animate-bounce-gentle">
            <Sparkles className="h-7 w-7 sm:h-10 sm:w-10 text-primary" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3" data-testid="text-cta-title">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent">
              Customer Support?
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 max-w-xl mx-auto px-4">
            Join thousands of businesses using ChatBot AI to provide instant, intelligent customer support. Get started in minutes, no coding required.
          </p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.text}
                className="flex items-center gap-1.5 sm:gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border/50"
              >
                <benefit.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 mb-6">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-sm sm:text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105" 
                data-testid="button-cta-get-started"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Started Free
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-sm sm:text-lg hover:bg-primary/5 transition-all duration-300" 
                data-testid="button-cta-schedule-demo"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-chart-2" />
              <span>No credit card required</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-chart-2" />
              <span>Free forever plan</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-chart-2" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
