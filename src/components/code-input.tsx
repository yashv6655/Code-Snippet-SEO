"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Code } from "lucide-react";

interface CodeInputProps {
  onGenerate: (code: string, language?: string) => Promise<void>;
  loading?: boolean;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

export function CodeInput({ onGenerate, loading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    await onGenerate(code, language || undefined);
  };

  return (
    <div className="card-modern p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Input Your Code</h2>
          <p className="text-muted-foreground">Paste any code snippet to generate SEO content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-base font-medium text-foreground mb-3">
            Code Snippet
          </label>
          <Textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="min-h-[200px] font-mono text-sm"
            required
          />
          <p className="text-sm text-muted-foreground mt-2">
            {code.length} characters
          </p>
        </div>

        <div>
          <label htmlFor="language" className="block text-base font-medium text-foreground mb-3">
            Programming Language
            <span className="text-muted-foreground font-normal ml-2">(Optional)</span>
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Auto-detect language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          disabled={!code.trim() || loading} 
          className="w-full h-12 text-base"
          size="lg"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Generate SEO Content
        </Button>
      </form>
    </div>
  );
}