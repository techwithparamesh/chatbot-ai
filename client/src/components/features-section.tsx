import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Bot, 
  FileUp, 
  Database, 
  Palette, 
  TestTube,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Automatic Website Scanner",
    description: "Crawls your entire website and extracts clean text from all pages, blogs, and FAQs.",
    icon: Search,
    highlight: "Smart Crawling",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "Custom AI Chatbot Creation",
    description: "Choose bot name, personality, and welcome message to match your brand voice.",
    icon: Bot,
    highlight: "Personalized",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    title: "Upload Extra Knowledge Files",
    description: "Supports PDFs, Docs, Notes, and more to enhance your chatbot's knowledge base.",
    icon: FileUp,
    highlight: "Multi-format",
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500",
  },
  {
    title: "Accurate Responses with RAG",
    description: "Vector database + AI ensures precise, contextual answers every time.",
    icon: Database,
    highlight: "AI-Powered",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500",
  },
  {
    title: "Fully Customizable Widget",
    description: "Match your brand colors, fonts, and website theme for seamless integration.",
    icon: Palette,
    highlight: "White Label",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-500",
  },
  {
    title: "Test URL Before Deploying",
    description: "Review and test your bot in a sandbox environment before going live.",
    icon: TestTube,
    highlight: "Safe Testing",
    color: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-10 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-chart-3/5 rounded-full blur-3xl" />
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
            Features
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-features-title">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-2 bg-clip-text text-transparent">
              Smart Automation
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Everything you need to create, customize, and deploy intelligent AI chatbots that understand your business
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card 
                className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden relative bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5" 
                data-testid={`card-feature-${index + 1}`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
                  <div className="flex items-start justify-between mb-3 sm:mb-5">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${feature.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs opacity-70 group-hover:opacity-100 transition-opacity hidden sm:inline-flex">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-3 group-hover:text-primary transition-colors line-clamp-1" data-testid={`text-feature-${index + 1}-title`}>
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-0 sm:mb-4 line-clamp-2" data-testid={`text-feature-${index + 1}-description`}>
                    {feature.description}
                  </p>
                  <div className="hidden sm:flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
