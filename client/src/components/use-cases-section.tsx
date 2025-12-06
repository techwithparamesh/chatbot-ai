import { Card, CardContent } from "@/components/ui/card";
import { Building2, ShoppingCart, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    title: "Business Websites",
    description: "Provide instant customer support, answer FAQs, and guide visitors to the right solutions 24/7.",
    icon: Building2,
    gradient: "from-primary/10 to-chart-1/10",
    iconColor: "text-primary",
  },
  {
    title: "E-commerce Stores",
    description: "Handle product inquiries, shipping questions, return policies, and boost sales with personalized recommendations.",
    icon: ShoppingCart,
    gradient: "from-chart-2/10 to-chart-4/10",
    iconColor: "text-chart-2",
  },
  {
    title: "Educational Sites",
    description: "Answer questions about courses, admissions, scheduling, and provide academic support to students.",
    icon: GraduationCap,
    gradient: "from-chart-3/10 to-chart-5/10",
    iconColor: "text-chart-3",
  },
  {
    title: "Agencies",
    description: "Explain services, share pricing information, and streamline the client onboarding process.",
    icon: Briefcase,
    gradient: "from-chart-4/10 to-chart-2/10",
    iconColor: "text-chart-4",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4" data-testid="text-use-cases-title">
            Use Cases
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different industries leverage ChatBot AI to enhance customer experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full hover-elevate transition-all duration-300 overflow-visible`} data-testid={`card-use-case-${index + 1}`}>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center`}>
                      <useCase.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${useCase.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2" data-testid={`text-use-case-${index + 1}-title`}>
                        {useCase.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none" data-testid={`text-use-case-${index + 1}-description`}>
                        {useCase.description}
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
