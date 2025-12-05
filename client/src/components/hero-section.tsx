import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Sparkles, Bot, MessageSquare, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useModal } from "@/pages/home";

export function HeroSection() {
  const { openModal } = useModal();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-3/5 dark:from-primary/10 dark:via-background dark:to-chart-3/10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chart-3/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              AI-Powered Customer Support
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            data-testid="text-hero-title"
          >
            Build Your Own AI Chatbot in{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent">
              2 Minutes
            </span>
            {" "}&mdash; No Coding Needed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            Scan your website → Train your bot → Embed it anywhere. Make your website answer customers instantly, 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Button size="lg" className="w-full sm:w-auto px-8" data-testid="button-get-started-hero" onClick={() => openModal("signup")}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8" data-testid="button-watch-demo" onClick={() => openModal("demo")}>
              <Play className="h-4 w-4 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle className="h-4 w-4 text-chart-2" />
            <span data-testid="text-trust-badge">No credit card required</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 lg:mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">chatbot-ai.com</span>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="bg-muted/50 rounded-xl rounded-tl-none p-4 max-w-sm">
                        <p className="text-sm">Hi! I'm your AI assistant. How can I help you today?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-none p-4 max-w-sm">
                        <p className="text-sm">What are your pricing plans?</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-chart-2" />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="bg-muted/50 rounded-xl rounded-tl-none p-4 max-w-sm">
                        <p className="text-sm">We offer three plans: Starter (Free), Pro ($29/mo), and Enterprise (Custom). Would you like details on any specific plan?</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-primary/5 to-chart-3/5 dark:from-primary/10 dark:to-chart-3/10 rounded-xl border border-border">
                    <Zap className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Instant Responses</h3>
                    <p className="text-sm text-muted-foreground">Your AI chatbot answers questions 24/7 based on your website content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
