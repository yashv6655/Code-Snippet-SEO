"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Code2, Github, AlertCircle, Info, Sparkles } from "lucide-react";

interface CodeWithRepoInputProps {
  onGenerate: (code: string, githubUrl?: string, language?: string) => void;
  loading: boolean;
}

export function CodeWithRepoInput({ onGenerate, loading }: CodeWithRepoInputProps) {
  const [code, setCode] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateGitHubUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
    return githubRegex.test(url.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Please enter a code snippet");
      return;
    }

    if (githubUrl.trim() && !validateGitHubUrl(githubUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    // const selectedLang = language === 'auto-detect' ? undefined : language;
    onGenerate(code, githubUrl.trim() || undefined, undefined);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (error) setError(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="card-modern p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Code Snippet + Context</h3>
            <p className="text-sm text-muted-foreground">
              Enter your code snippet and optionally add repository context for better SEO
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code Input */}
          <div className="space-y-2">
            <label htmlFor="code-input" className="block text-sm font-medium text-foreground">
              Code Snippet *
            </label>
            <Textarea
              id="code-input"
              placeholder="// Paste your code snippet here&#10;function example() {&#10;  return 'Hello, world!';&#10;}"
              value={code}
              onChange={handleCodeChange}
              className={`min-h-[200px] font-mono text-sm transition-colors ${
                error && !code.trim()
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                  : ""
              }`}
              disabled={loading}
            />
          </div>

          {/* Repository Context (Optional) */}
          <div className="space-y-2">
            <label htmlFor="github-url" className="block text-sm font-medium text-foreground">
              Repository Context (Optional)
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/owner/repository"
                value={githubUrl}
                onChange={handleUrlChange}
                className={`pl-10 transition-colors ${
                  error && githubUrl.trim() && !validateGitHubUrl(githubUrl)
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                    : ""
                }`}
                disabled={loading}
              />
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>
                Adding repository context helps generate more accurate SEO content by understanding your project structure, dependencies, and purpose.
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || !code.trim()} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating SEO Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate SEO Content
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">How it works:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0"></div>
              <span>Analyzes your specific code snippet for functionality and patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0"></div>
              <span>Uses repository context to understand project purpose and dependencies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0"></div>
              <span>Generates SEO-optimized titles, descriptions, and structured data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0"></div>
              <span>Creates developer-focused content for better discoverability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="card-modern p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Why add repository context?</p>
            <p className="text-muted-foreground">
              Repository context helps the AI understand your code&apos;s role within the larger project, 
              leading to more accurate SEO content that developers will actually find useful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}