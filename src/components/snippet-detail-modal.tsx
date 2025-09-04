"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, FileText, Code, Globe, X } from "lucide-react";
import { Snippet } from "@/types/snippet";
import { trackEvent } from "@/lib/analytics";

interface SnippetDetailModalProps {
  snippet: Snippet;
  isOpen: boolean;
  onClose: () => void;
}

export function SnippetDetailModal({ snippet, isOpen, onClose }: SnippetDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleClose = () => {
    trackEvent('snippet_modal_closed', {
      snippet_id: snippet.id,
      language: snippet.language || 'unknown'
    });
    onClose();
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      trackEvent('snippet_copy_to_clipboard', {
        field: field,
        text_length: text.length,
        source: 'modal_detail',
        snippet_id: snippet.id
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      trackEvent('snippet_copy_failed', {
        field: field,
        error: 'clipboard_write_failed',
        snippet_id: snippet.id
      });
    }
  };

  const downloadHTML = () => {
    trackEvent('snippet_download_html', {
      snippet_id: snippet.id,
      language: snippet.language || 'unknown',
      source: 'modal_detail',
      file_size: snippet.html_output?.length || 0
    });
    const blob = new Blob([snippet.html_output || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snippet.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonData = {
      title: snippet.title,
      description: snippet.description,
      explanation: snippet.explanation,
      schema_markup: snippet.schema_markup,
    };
    trackEvent('snippet_download_json', {
      snippet_id: snippet.id,
      language: snippet.language || 'unknown',
      source: 'modal_detail',
      file_size: JSON.stringify(jsonData, null, 2).length
    });
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snippet.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Snippet Details</h2>
            <p className="text-gray-600 text-sm">
              Created {new Date(snippet.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={downloadHTML} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              HTML
            </Button>
            <Button onClick={downloadJSON} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" style={{minHeight: 0}}>
          {/* Original Code */}
          {snippet.code && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium text-gray-900">Original Code</label>
                  {snippet.language && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {snippet.language}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => copyToClipboard(snippet.code, "code")}
                  variant="ghost"
                  size="sm"
                >
                  {copiedField === "code" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded">
                <pre className="text-sm font-mono text-gray-900 whitespace-pre-wrap overflow-auto">
                  {snippet.code}
                </pre>
              </div>
            </div>
          )}

          {/* SEO Title */}
          {snippet.title && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium text-gray-900">SEO Title</label>
                </div>
                <Button
                  onClick={() => copyToClipboard(snippet.title || "", "title")}
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
              <div className="p-3 bg-white border border-gray-100 rounded">
                <p className="text-sm font-medium text-gray-900">{snippet.title}</p>
              </div>
            </div>
          )}

          {/* Meta Description */}
          {snippet.description && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium text-gray-900">Meta Description</label>
                </div>
                <Button
                  onClick={() => copyToClipboard(snippet.description || "", "description")}
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
              <div className="p-3 bg-white border border-gray-100 rounded">
                <p className="text-sm text-gray-900">{snippet.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {snippet.description.length}/160 characters
                  </p>
                  {snippet.description.length <= 160 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-success">Optimal length</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {snippet.explanation && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium text-gray-900">Code Explanation</label>
                </div>
                <Button
                  onClick={() => copyToClipboard(snippet.explanation || "", "explanation")}
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
              <div className="p-3 bg-white border border-gray-100 rounded">
                <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {snippet.explanation}
                </p>
              </div>
            </div>
          )}

          {/* HTML Preview */}
          {snippet.html_output && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">HTML Output</label>
                <Button
                  onClick={() => copyToClipboard(snippet.html_output || "", "html")}
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
                  dangerouslySetInnerHTML={{ __html: snippet.html_output }}
                />
              </div>
            </div>
          )}

          {/* JSON-LD Schema */}
          {snippet.schema_markup && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">JSON-LD Schema Markup</label>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(snippet.schema_markup, null, 2), "schema")}
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
              <div className="p-3 bg-white border border-gray-100 rounded">
                <pre className="text-xs font-mono text-gray-900 overflow-auto whitespace-pre-wrap max-h-64">
                  {JSON.stringify(snippet.schema_markup, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}