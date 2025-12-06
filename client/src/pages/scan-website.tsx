import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, useAuthenticatedFetch } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, 
  ArrowLeft, 
  Globe, 
  Loader2, 
  CheckCircle,
  Search,
  FileText,
  ArrowRight
} from "lucide-react";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL (e.g., https://example.com)"),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface Website {
  id: string;
  url: string;
  status: string;
  pagesScanned: string[];
  content: { url: string; title: string; content: string }[];
}

export default function ScanWebsite() {
  const authFetch = useAuthenticatedFetch();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
  const [scanComplete, setScanComplete] = useState(false);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  // Poll for website status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentWebsite && isScanning) {
      interval = setInterval(async () => {
        try {
          const res = await authFetch(`/api/websites/${currentWebsite.id}`);
          if (res.ok) {
            const updated = await res.json();
            setCurrentWebsite(updated);
            
            if (updated.status === "scanning") {
              setProgress((prev) => Math.min(prev + 15, 85));
            } else if (updated.status === "completed") {
              setProgress(100);
              setIsScanning(false);
              setScanComplete(true);
              clearInterval(interval);
            } else if (updated.status === "failed") {
              setIsScanning(false);
              toast({
                title: "Scan failed",
                description: "Failed to scan the website. Please try again.",
                variant: "destructive",
              });
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error("Failed to fetch website status:", error);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentWebsite?.id, isScanning]);

  const onSubmit = async (data: UrlFormData) => {
    setIsScanning(true);
    setProgress(10);
    setScanComplete(false);
    
    try {
      const res = await authFetch("/api/websites", {
        method: "POST",
        body: JSON.stringify({ url: data.url }),
      });
      
      if (res.ok) {
        const website = await res.json();
        setCurrentWebsite(website);
        setProgress(25);
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to start scan");
      }
    } catch (error) {
      setIsScanning(false);
      setProgress(0);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scan website",
        variant: "destructive",
      });
    }
  };

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-chart-2/10 mb-4">
            <Globe className="h-8 w-8 text-chart-2" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Scan Your Website
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your website URL and we'll automatically extract all content to train your chatbot.
          </p>
        </div>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Website URL</CardTitle>
            <CardDescription>
              We'll crawl your website and extract content from all pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scanComplete ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com" 
                              className="pl-10 h-12"
                              disabled={isScanning}
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isScanning && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Scanning website...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          {progress < 30 && "Starting scan..."}
                          {progress >= 30 && progress < 60 && "Discovering pages..."}
                          {progress >= 60 && progress < 90 && "Extracting content..."}
                          {progress >= 90 && "Finishing up..."}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium gap-2" 
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Start Scanning
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                {/* Success State */}
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-chart-2/10 mb-4">
                    <CheckCircle className="h-7 w-7 text-chart-2" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    Scan Complete!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We've extracted content from your website.
                  </p>
                </div>

                {/* Scan Results */}
                {currentWebsite && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-none">
                            {currentWebsite.url}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentWebsite.pagesScanned?.length || 0} pages found
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        Completed
                      </Badge>
                    </div>

                    {/* Pages List */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Extracted Pages:</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {currentWebsite.content?.map((page, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{page.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setScanComplete(false);
                      setProgress(0);
                      setCurrentWebsite(null);
                      form.reset();
                    }}
                  >
                    Scan Another Website
                  </Button>
                  <Link href={`/dashboard/create-bot?websiteId=${currentWebsite?.id}`} className="flex-1">
                    <Button className="w-full gap-2">
                      Create Chatbot
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        {!scanComplete && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Auto-crawls all pages</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-2">
                <FileText className="h-5 w-5 text-chart-2" />
              </div>
              <p className="text-sm text-muted-foreground">Extracts text content</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center mx-auto mb-2">
                <Bot className="h-5 w-5 text-chart-3" />
              </div>
              <p className="text-sm text-muted-foreground">Ready for your bot</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
