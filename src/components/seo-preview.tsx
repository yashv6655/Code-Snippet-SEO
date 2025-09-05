"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, FileText, Code, Globe } from "lucide-react";
import { GenerateResponse } from "@/types/snippet";
import { trackEvent } from "@/lib/analytics";

interface SEOPreviewProps {
  result: GenerateResponse;
}

export function SEOPreview({ result }: SEOPreviewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      trackEvent('snippet_copy_to_clipboard', {
        field: field,
        text_length: text.length,
        source: 'seo_preview'
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      trackEvent('snippet_copy_failed', {
        field: field,
        error: 'clipboard_write_failed'
      });
    }
  };

  const downloadHTML = () => {
    trackEvent('snippet_download_html', {
      source: 'seo_preview',
      file_size: result.html_output.length
    });
    const blob = new Blob([result.html_output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-snippet-seo.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonData = {
      title: result.title,
      description: result.description,
      explanation: result.explanation,
      schema_markup: result.schema_markup,
    };
    trackEvent('snippet_download_json', {
      source: 'seo_preview',
      file_size: JSON.stringify(jsonData, null, 2).length
    });
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="card-modern p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Generated SEO Content</h3>
            <p className="text-muted-foreground">Ready to publish and rank</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadHTML} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            HTML
          </Button>
          <Button onClick={downloadJSON} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* SEO Title */}
        <div className="card-modern p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-foreground">SEO Title</label>
            </div>
            <Button
              onClick={() => copyToClipboard(result.title, "title")}
              variant="ghost"
              size="sm"
            >
              {copiedField === "title" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm font-medium text-foreground">{result.title}</p>
          </div>
        </div>

        {/* Meta Description */}
        <div className="card-modern p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Meta Description</label>
            </div>
            <Button
              onClick={() => copyToClipboard(result.description, "description")}
              variant="ghost"
              size="sm"
            >
              {copiedField === "description" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-foreground">{result.description}</p>
            <div className="flex items-center justify-end mt-2">
              {result.description.length <= 160 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success">Optimal length</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="card-modern p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Code Explanation</label>
            </div>
            <Button
              onClick={() => copyToClipboard(result.explanation, "explanation")}
              variant="ghost"
              size="sm"
            >
              {copiedField === "explanation" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
          </div>
        </div>

        {/* HTML Preview */}
        <div className="card-modern p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">HTML Output</label>
            <Button
              onClick={() => copyToClipboard(result.html_output, "html")}
              variant="ghost"
              size="sm"
            >
              {copiedField === "html" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/30 border-b">
              <p className="text-xs font-mono text-muted-foreground">HTML Preview</p>
            </div>
            <div 
              className="p-4 bg-muted/20 max-h-96 overflow-auto"
              dangerouslySetInnerHTML={{ __html: result.html_output }}
            />
          </div>
        </div>

        {/* JSON-LD Schema */}
        <div className="card-modern p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">JSON-LD Schema Markup</label>
            <Button
              onClick={() => copyToClipboard(JSON.stringify(result.schema_markup, null, 2), "schema")}
              variant="ghost"
              size="sm"
            >
              {copiedField === "schema" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <pre className="text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap">
              {JSON.stringify(result.schema_markup, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border/50">
        <Button onClick={downloadHTML} className="flex-1" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Download HTML
        </Button>
        <Button onClick={downloadJSON} variant="outline" className="flex-1" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Download JSON
        </Button>
      </div>
    </div>
  );
}