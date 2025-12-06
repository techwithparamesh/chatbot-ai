import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Sparkles, Bot, MessageSquare, Zap, Globe, Users, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const stats = [
  { icon: Users, value: "10K+", label: "Active Users" },
  { icon: Globe, value: "50+", label: "Countries" },
  { icon: Clock, value: "24/7", label: "Support" },
];

const trustBadges = [
  "No credit card required",
  "Free forever plan",
  "Cancel anytime",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-3/5 dark:from-primary/10 dark:via-background dark:to-chart-3/10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chart-3/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 bg-primary/20 rounded-lg animate-float hidden lg:flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute top-1/3 right-[15%] w-10 h-10 bg-chart-2/20 rounded-full animate-float-delayed hidden lg:flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-chart-2" />
        </div>
        <div className="absolute bottom-1/4 left-[15%] w-14 h-14 bg-chart-3/20 rounded-xl animate-float hidden lg:flex items-center justify-center" style={{ animationDelay: "0.5s" }}>
          <Zap className="w-7 h-7 text-chart-3" />
        </div>
        <div className="absolute bottom-1/3 right-[10%] w-11 h-11 bg-primary/15 rounded-lg animate-float-delayed hidden lg:flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-background/50 backdrop-blur-sm border-primary/20">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent font-medium">
                AI-Powered Customer Support
              </span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4"
            data-testid="text-hero-title"
          >
            Build Your Own AI Chatbot in{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              2 Minutes
            </span>
            {" "}&mdash; No Coding Needed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4"
            data-testid="text-hero-subtitle"
          >
            Scan your website → Train your bot → Embed it anywhere. Make your website answer customers instantly, 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 px-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105" 
                data-testid="button-get-started-hero"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-8 hover:bg-primary/5 transition-all duration-300" 
                data-testid="button-watch-demo"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground"
          >
            {trustBadges.map((badge, index) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <span data-testid={`text-trust-badge-${index}`}>{badge}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats Section - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hidden sm:flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-border/50"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-16 lg:mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-chart-3/20 to-chart-2/20 blur-3xl opacity-50 -z-10" />
            
            <div className="bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden hover-lift">
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">chatbot-ai.com</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                  <span className="text-xs text-chart-2">Live</span>
                </div>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="bg-muted/50 rounded-xl rounded-tl-none p-4 max-w-sm">
                        <p className="text-sm">Hi! I'm your AI assistant. How can I help you today?</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                      className="flex items-start gap-3 justify-end"
                    >
                      <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-none p-4 max-w-sm">
                        <p className="text-sm">What are your pricing plans?</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-chart-2" />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="bg-muted/50 rounded-xl rounded-tl-none p-4 max-w-sm">
                        <p className="text-sm">We offer three plans: Starter (Free), Pro ($29/mo), and Enterprise (Custom). Would you like details on any specific plan?</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="hidden lg:flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-primary/5 to-chart-3/5 dark:from-primary/10 dark:to-chart-3/10 rounded-xl border border-border">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 animate-bounce-gentle">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Instant Responses</h3>
                    <p className="text-sm text-muted-foreground mb-4">Your AI chatbot answers questions 24/7 based on your website content</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-chart-2" />
                      <span>Average response time: 0.3s</span>
                    </div>
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
