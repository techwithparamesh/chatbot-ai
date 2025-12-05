import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "ChatBot AI reduced our support tickets by 60% in the first month. It's like having an extra team member who never sleeps!",
    author: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    initials: "SJ",
  },
  {
    quote: "The setup was incredibly easy. We had our AI chatbot live within 10 minutes of signing up. Highly recommend!",
    author: "Michael Chen",
    role: "E-commerce Manager",
    company: "StyleHub",
    initials: "MC",
  },
  {
    quote: "Our conversion rate increased by 35% after implementing ChatBot AI. Customers love getting instant answers.",
    author: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthLabs",
    initials: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="text-testimonials-title">
            Loved by Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience with ChatBot AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate transition-all duration-300 overflow-visible" data-testid={`card-testimonial-${index + 1}`}>
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4" data-testid={`rating-testimonial-${index + 1}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  
                  <blockquote className="text-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-${index + 1}-quote`}>
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <Avatar data-testid={`avatar-testimonial-${index + 1}`}>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm" data-testid={`text-testimonial-${index + 1}-author`}>
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-${index + 1}-role`}>
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
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
