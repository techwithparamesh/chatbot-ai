import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const faqs = [
  {
    question: "How does the AI chatbot learn from my website?",
    answer: "When you provide your website URL, our AI scans all accessible pages and content. It then uses advanced natural language processing to understand your business, products, services, and FAQs. The bot is trained specifically on your content to provide accurate, relevant responses to your customers."
  },
  {
    question: "Can I customize the chatbot's appearance?",
    answer: "Absolutely! You can customize the chatbot's colors, avatar, welcome message, and position on your website. Pro and Enterprise plans offer additional customization options including custom CSS, white-labeling, and branded chat experiences."
  },
  {
    question: "What languages does the chatbot support?",
    answer: "Our AI chatbot supports over 50 languages including English, Spanish, French, German, Chinese, Japanese, and more. The bot can automatically detect the user's language and respond accordingly, making it perfect for international businesses."
  },
  {
    question: "How do I add the chatbot to my website?",
    answer: "It's simple! After creating your chatbot, you'll receive a small JavaScript snippet. Just paste this code into your website's HTML (before the closing </body> tag), and the chatbot will appear automatically. We also provide plugins for WordPress, Shopify, and other platforms."
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes! Our Starter plan is completely free and includes 1 chatbot, 100 messages per month, and basic customization. It's perfect for small websites and testing the platform. You can upgrade anytime as your needs grow."
  },
  {
    question: "Can I upload additional training data?",
    answer: "Yes, you can enhance your chatbot's knowledge by uploading documents (PDF, DOC, TXT), FAQs, and other training materials. This helps the AI provide more comprehensive and accurate answers to your customers' questions."
  },
  {
    question: "How secure is my data?",
    answer: "Security is our top priority. All data is encrypted in transit and at rest. We're SOC 2 compliant and GDPR ready. Your website content and chat logs are stored securely and never shared with third parties. Enterprise plans include additional security features like SSO and custom data retention policies."
  },
  {
    question: "What happens when the AI can't answer a question?",
    answer: "When the AI encounters a question it can't confidently answer, it can be configured to gracefully hand off to a human agent, collect the user's contact information, or suggest alternative resources. You can customize this behavior in your chatbot settings."
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-10 sm:py-16 lg:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 mb-4 sm:mb-6">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about ChatBot AI. Can't find the answer you're looking for? 
            Feel free to contact our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium text-base sm:text-lg pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-chart-3/10 to-chart-2/10 rounded-2xl p-8 border border-border">
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get started.
            </p>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
