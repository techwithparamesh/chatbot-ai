import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthenticatedFetch } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, 
  ArrowLeft, 
  ArrowRight,
  Loader2, 
  CheckCircle,
  Sparkles,
  MessageSquare,
  Globe,
  Upload,
  Wand2
} from "lucide-react";

const botNameSchema = z.object({
  name: z.string().min(2, "Bot name must be at least 2 characters"),
});

const greetingSchema = z.object({
  greetingType: z.enum(["custom", "ai"]),
  customGreeting: z.string().optional(),
});

type BotNameFormData = z.infer<typeof botNameSchema>;
type GreetingFormData = z.infer<typeof greetingSchema>;

interface Website {
  id: string;
  url: string;
  status: string;
  content: { url: string; title: string; content: string }[];
}

const aiGreetings = [
  "Hello! I'm here to help you with any questions about our services. How can I assist you today?",
  "Hi there! Welcome! I'm your virtual assistant. What would you like to know?",
  "Hey! Great to see you. I'm ready to answer any questions you might have. What's on your mind?",
];

export default function CreateBot() {
  const authFetch = useAuthenticatedFetch();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [botName, setBotName] = useState("");
  const [greetingType, setGreetingType] = useState<"custom" | "ai">("custom");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [createdBotId, setCreatedBotId] = useState<string | null>(null);

  // Get websiteId from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const websiteId = params.get("websiteId");
    if (websiteId) {
      setSelectedWebsiteId(websiteId);
    }
  }, [searchString]);

  // Fetch available websites
  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const res = await authFetch("/api/websites");
      if (res.ok) {
        const data = await res.json();
        setWebsites(data.filter((w: Website) => w.status === "completed"));
      }
    } catch (error) {
      console.error("Failed to fetch websites:", error);
    }
  };

  const nameForm = useForm<BotNameFormData>({
    resolver: zodResolver(botNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const greetingForm = useForm<GreetingFormData>({
    resolver: zodResolver(greetingSchema),
    defaultValues: {
      greetingType: "custom",
      customGreeting: "",
    },
  });

  const handleNameSubmit = (data: BotNameFormData) => {
    setBotName(data.name);
    setStep(2);
  };

  const handleGenerateGreeting = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomGreeting = aiGreetings[Math.floor(Math.random() * aiGreetings.length)];
    setGreetingMessage(randomGreeting);
    greetingForm.setValue("customGreeting", randomGreeting);
    setIsGenerating(false);
  };

  const handleGreetingSubmit = (data: GreetingFormData) => {
    setGreetingType(data.greetingType);
    if (data.greetingType === "custom" && data.customGreeting) {
      setGreetingMessage(data.customGreeting);
    }
    setStep(3);
  };

  const handleCreateBot = async () => {
    setIsLoading(true);
    
    try {
      // Create the chatbot
      const createRes = await authFetch("/api/chatbots", {
        method: "POST",
        body: JSON.stringify({
          name: botName,
          websiteId: selectedWebsiteId,
          greetingType,
          greetingMessages: [greetingMessage || "Hello! How can I help you today?"],
        }),
      });
      
      if (!createRes.ok) {
        throw new Error("Failed to create chatbot");
      }
      
      const chatbot = await createRes.json();
      setCreatedBotId(chatbot.id);
      
      // If a website is selected, upload the knowledge base
      if (selectedWebsiteId) {
        await authFetch(`/api/chatbots/${chatbot.id}/knowledge`, {
          method: "POST",
          body: JSON.stringify({ websiteId: selectedWebsiteId }),
        });
      }
      
      setStep(4);
      toast({
        title: "Chatbot created!",
        description: "Your AI chatbot is ready to test.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chatbot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s < step
                ? "bg-chart-2 text-white"
                : s === step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s < step ? <CheckCircle className="h-4 w-4" /> : s}
          </div>
          {s < 4 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-1 ${
                s < step ? "bg-chart-2" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Create Your Chatbot
          </h1>
          <p className="text-muted-foreground">
            {step === 1 && "Let's start by naming your bot"}
            {step === 2 && "Set up how your bot greets visitors"}
            {step === 3 && "Connect your knowledge base"}
            {step === 4 && "Your chatbot is ready!"}
          </p>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Bot Name */}
        {step === 1 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Name Your Bot</CardTitle>
              <CardDescription>
                Choose a friendly name for your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...nameForm}>
                <form onSubmit={nameForm.handleSubmit(handleNameSubmit)} className="space-y-6">
                  <FormField
                    control={nameForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Support Assistant, Sales Bot" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Greeting Messages */}
        {step === 2 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-chart-2/10 flex items-center justify-center mb-2">
                <MessageSquare className="h-7 w-7 text-chart-2" />
              </div>
              <CardTitle>Set Greeting Message</CardTitle>
              <CardDescription>
                How should your bot respond to "hi", "hello", etc.?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...greetingForm}>
                <form onSubmit={greetingForm.handleSubmit(handleGreetingSubmit)} className="space-y-6">
                  <FormField
                    control={greetingForm.control}
                    name="greetingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="custom"
                                id="custom"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="custom"
                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                              >
                                <MessageSquare className="mb-2 h-6 w-6" />
                                <span className="font-medium">Custom Message</span>
                                <span className="text-xs text-muted-foreground">Write your own</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="ai"
                                id="ai"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="ai"
                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                              >
                                <Sparkles className="mb-2 h-6 w-6" />
                                <span className="font-medium">AI Generated</span>
                                <span className="text-xs text-muted-foreground">Let AI create it</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={greetingForm.control}
                    name="customGreeting"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Greeting Message</FormLabel>
                          {greetingForm.watch("greetingType") === "ai" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 h-8"
                              onClick={handleGenerateGreeting}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Wand2 className="h-3.5 w-3.5" />
                              )}
                              Generate
                            </Button>
                          )}
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Hello! I'm here to help. What can I assist you with today?"
                            className="min-h-[100px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 h-12 gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Knowledge Base */}
        {step === 3 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-chart-3/10 flex items-center justify-center mb-2">
                <Upload className="h-7 w-7 text-chart-3" />
              </div>
              <CardTitle>Connect Knowledge Base</CardTitle>
              <CardDescription>
                Select a scanned website to train your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {websites.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No scanned websites found. You can scan one now or skip this step.
                  </p>
                  <Link href="/dashboard/scan-website">
                    <Button variant="outline" className="gap-2">
                      <Globe className="h-4 w-4" />
                      Scan a Website
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select a Website</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        onClick={() => setSelectedWebsiteId(website.id)}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedWebsiteId === website.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{website.url}</p>
                            <p className="text-xs text-muted-foreground">
                              {website.content?.length || 0} pages
                            </p>
                          </div>
                        </div>
                        {selectedWebsiteId === website.id && (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCreateBot}
                  disabled={isLoading}
                  className="flex-1 h-12 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Chatbot
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {websites.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setSelectedWebsiteId(null);
                    handleCreateBot();
                  }}
                  disabled={isLoading}
                >
                  Skip - I'll add knowledge later
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-chart-2" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-muted-foreground">
                    Your chatbot <span className="font-semibold text-foreground">{botName}</span> is ready!
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-sm mb-2">What's next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                      Test your chatbot using the test URL
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                      Verify it answers questions correctly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                      Embed it on your website when ready
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/chat/test/${createdBotId}`} className="flex-1">
                    <Button className="w-full h-12 gap-2">
                      <Bot className="h-4 w-4" />
                      Test Your Chatbot
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full h-12">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
