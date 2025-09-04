"use client";

import { useState } from "react";
import { CodeInput } from "@/components/code-input";
import { SEOPreview } from "@/components/seo-preview";
import { SaveSnippetButton } from "@/components/save-snippet-button";
import { Header } from "@/components/header";
import { GenerateResponse } from "@/types/snippet";
import { trackEvent } from "@/lib/analytics";
import { Sparkles, Zap, Target } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const handleGenerate = async (code: string, language?: string) => {
    setLoading(true);
    setError(null);
    setOriginalCode(code);
    setSelectedLanguage(language || "");
    
    trackEvent("snippet_generation_started", { 
      language: language || "auto-detect",
      code_length: code.length 
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        trackEvent("snippet_generation_failed", { 
          error: data.error,
          language: language || "auto-detect" 
        });
        throw new Error(data.error || "Failed to generate content");
      }

      setResult(data);
      trackEvent("snippet_generation_success", { 
        language: language || "auto-detect",
        title_length: data.title?.length || 0,
        description_length: data.description?.length || 0 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Header />
      
      {/* Hero Header */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered SEO Content Generation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Code Snippet SEO Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your code examples into search-optimized content that developers actually find
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Input Section */}
          <div className="order-1">
            <CodeInput onGenerate={handleGenerate} loading={loading} />
            
            {error && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded-full"></div>
                  <p className="text-destructive font-medium">Something went wrong</p>
                </div>
                <p className="text-destructive/80 text-sm mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="order-2">
            {result ? (
              <div>
                <SaveSnippetButton 
                  result={result}
                  originalCode={originalCode}
                  language={selectedLanguage}
                />
                <SEOPreview 
                  result={result} 
                  originalCode={originalCode}
                  language={selectedLanguage}
                />
              </div>
            ) : (
              <div className="card-modern p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
                <p className="text-muted-foreground mb-6">
                  Enter your code snippet to create SEO-optimized content with structured data
                </p>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    SEO-friendly titles & descriptions
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    JSON-LD structured data markup
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    Ready-to-publish HTML output
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 pt-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Use Code Snippet SEO Generator?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your code examples into traffic-generating SEO assets
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant SEO Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate SEO-optimized titles, descriptions, and structured data in seconds
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Better Search Rankings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Capture &quot;code example&quot; searches with optimized content that developers actually find
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Developer Focused</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built specifically for developer tool companies and technical content creators
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Code Snippet SEO Generator. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}