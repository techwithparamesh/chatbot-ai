import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Bot, 
  FileUp, 
  Database, 
  Palette, 
  TestTube 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Automatic Website Scanner",
    description: "Crawls your entire website and extracts clean text from all pages, blogs, and FAQs.",
    icon: Search,
  },
  {
    title: "Custom AI Chatbot Creation",
    description: "Choose bot name, personality, and welcome message to match your brand voice.",
    icon: Bot,
  },
  {
    title: "Upload Extra Knowledge Files",
    description: "Supports PDFs, Docs, Notes, and more to enhance your chatbot's knowledge base.",
    icon: FileUp,
  },
  {
    title: "Accurate Responses with RAG",
    description: "Vector database + AI ensures precise, contextual answers every time.",
    icon: Database,
  },
  {
    title: "Fully Customizable Widget",
    description: "Match your brand colors, fonts, and website theme for seamless integration.",
    icon: Palette,
  },
  {
    title: "Test URL Before Deploying",
    description: "Review and test your bot in a sandbox environment before going live.",
    icon: TestTube,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="text-features-title">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, customize, and deploy intelligent AI chatbots
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate transition-all duration-300" data-testid={`card-feature-${index + 1}`}>
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid={`text-feature-${index + 1}-title`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-${index + 1}-description`}>
                    {feature.description}
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
