"use client";

import { useState } from "react";
import { CodeWithRepoInput } from "@/components/code-with-repo-input";
import { SEOPreview } from "@/components/seo-preview";
import { SaveSnippetButton } from "@/components/save-snippet-button";
import { Header } from "@/components/header";
import { GenerateResponse } from "@/types/snippet";
import { trackEvent } from "@/lib/analytics";
import { Sparkles, Zap, Target, GitBranch } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");

  const handleGenerate = async (code: string, githubUrl?: string, language?: string) => {
    setLoading(true);
    setError(null);
    setOriginalCode(code);
    setSelectedLanguage(language || "");
    setRepoUrl(githubUrl || "");
    
    trackEvent("snippet_with_context_generation_started", { 
      language: language || "auto-detect",
      code_length: code.length,
      has_repo_context: !!githubUrl
    });

    try {
      const response = await fetch("/api/generate-with-context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          code, 
          language,
          githubUrl: githubUrl || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        trackEvent("snippet_generation_failed", { 
          error: data.error,
          language: language || "auto-detect",
          has_repo_context: !!githubUrl
        });
        throw new Error(data.error || "Failed to generate content");
      }

      setResult(data);
      trackEvent("snippet_generation_success", { 
        language: language || "auto-detect",
        title_length: data.title?.length || 0,
        description_length: data.description?.length || 0,
        has_repo_context: !!githubUrl
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
              <GitBranch className="w-4 h-4" />
              AI-Powered SEO with Repository Context
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Context-Aware Code SEO Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your code snippets into SEO-optimized content with full repository context for better developer discoverability
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Input Section */}
          <div className="order-1">
            <CodeWithRepoInput onGenerate={handleGenerate} loading={loading} />
            
            {error && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded-full"></div>
                  <p className="text-destructive font-medium">Generation Failed</p>
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
                  repoUrl={repoUrl}
                />
                <SEOPreview 
                  result={result} 
                />
              </div>
            ) : (
              <div className="card-modern p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
                <p className="text-muted-foreground mb-6">
                  Enter your code snippet and optional repository URL for context-aware SEO content
                </p>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    Context-aware SEO optimization
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    Repository-informed descriptions
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    Structured data with project context
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    Developer-focused content optimization
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
              Why Use Context-Aware Code SEO?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create better SEO content by combining your specific code examples with full project context
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Repository Context</h3>
              <p className="text-muted-foreground leading-relaxed">
                Understands your project structure, dependencies, and purpose for more accurate SEO content
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Focused Code Examples</h3>
              <p className="text-muted-foreground leading-relaxed">
                Highlight specific functions, components, or patterns while maintaining full project context
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Better Developer Discovery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create content that actually helps developers find and understand your specific code solutions
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Context-Aware Code SEO Generator. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}