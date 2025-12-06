import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthenticatedFetch } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, 
  ArrowLeft, 
  Save,
  Loader2,
  Settings,
  MessageSquare,
  Code,
  Globe,
  Copy,
  ExternalLink,
  Eye,
  CheckCircle
} from "lucide-react";

const settingsSchema = z.object({
  name: z.string().min(2, "Bot name must be at least 2 characters"),
  greetingMessage: z.string().min(1, "Greeting message is required"),
  isActive: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface Chatbot {
  id: string;
  name: string;
  greetingMessages: string[];
  isActive: boolean;
  testUrl: string;
  embedCode: string;
  knowledgeBase: { url: string; title: string; content: string }[];
  websiteId: string | null;
  createdAt: string;
}

export default function ChatbotSettings() {
  const params = useParams();
  const chatbotId = params.id;
  const authFetch = useAuthenticatedFetch();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      greetingMessage: "",
      isActive: false,
    },
  });

  useEffect(() => {
    fetchChatbot();
  }, [chatbotId]);

  const fetchChatbot = async () => {
    try {
      const res = await authFetch(`/api/chatbots/${chatbotId}`);
      if (res.ok) {
        const data = await res.json();
        setChatbot(data);
        form.reset({
          name: data.name,
          greetingMessage: data.greetingMessages?.[0] || "",
          isActive: data.isActive || false,
        });
      } else {
        toast({
          title: "Error",
          description: "Chatbot not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to load chatbot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/chatbots/${chatbotId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          greetingMessages: [data.greetingMessage],
          isActive: data.isActive,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setChatbot(updated);
        toast({
          title: "Settings saved",
          description: "Your chatbot settings have been updated.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyEmbedCode = () => {
    if (chatbot?.embedCode) {
      navigator.clipboard.writeText(chatbot.embedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!chatbot) {
    return null;
  }

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
              <Link href={`/chat/test/${chatbotId}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Test</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{chatbot.name}</h1>
              <p className="text-sm text-muted-foreground">
                Created {new Date(chatbot.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={chatbot.isActive ? "default" : "secondary"} className="w-fit">
            {chatbot.isActive ? "Active" : "Draft"}
          </Badge>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4 hidden sm:block" />
              General
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <Globe className="h-4 w-4 hidden sm:block" />
              Knowledge
            </TabsTrigger>
            <TabsTrigger value="embed" className="gap-2">
              <Code className="h-4 w-4 hidden sm:block" />
              Embed
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure your chatbot's basic settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="My Chatbot"
                              className="h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="greetingMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Greeting Message
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Hello! How can I help you today?"
                              className="min-h-[100px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="active-toggle">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable this chatbot for production use
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              id="active-toggle"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>
                  Content your chatbot uses to answer questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chatbot.knowledgeBase && chatbot.knowledgeBase.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {chatbot.knowledgeBase.length} pages in knowledge base
                      </p>
                      <Link href="/dashboard/scan-website">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Globe className="h-4 w-4" />
                          Scan New Website
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {chatbot.knowledgeBase.map((page, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{page.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-1">No knowledge base</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan a website to create a knowledge base for your chatbot
                    </p>
                    <Link href="/dashboard/scan-website">
                      <Button className="gap-2">
                        <Globe className="h-4 w-4" />
                        Scan Website
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embed Code */}
          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Embed Code
                </CardTitle>
                <CardDescription>
                  Add this code to your website to display the chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Embed Script</Label>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                      <code className="text-foreground break-all">
                        {chatbot.embedCode || `<script src="${window.location.origin}/embed/${chatbot.id}.js"></script>`}
                      </code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 gap-1.5"
                      onClick={copyEmbedCode}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-chart-2" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add this script tag to your website's HTML, just before the closing &lt;/body&gt; tag.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Test URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={`${window.location.origin}/chat/test/${chatbot.id}`}
                      readOnly
                      className="flex-1 text-sm"
                    />
                    <Link href={`/chat/test/${chatbot.id}`}>
                      <Button variant="outline" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this URL to test your chatbot before deploying.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
