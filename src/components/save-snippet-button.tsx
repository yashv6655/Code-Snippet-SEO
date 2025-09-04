"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import { GenerateResponse } from "@/types/snippet";
import { useAuth } from "@/components/providers/auth-provider";

interface SaveSnippetButtonProps {
  result: GenerateResponse;
  originalCode: string;
  language: string;
}

export function SaveSnippetButton({ result, originalCode, language }: SaveSnippetButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user || !originalCode) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: originalCode,
          language,
          title: result.title,
          description: result.description,
          explanation: result.explanation,
          html_output: result.html_output,
          schema_markup: result.schema_markup,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        setError(errorData.error || 'Failed to save snippet');
      }
    } catch (error) {
      console.error('Failed to save snippet:', error);
      setError('Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !originalCode) return null;

  return (
    <div className="flex flex-col items-end mb-4">
      <Button 
        onClick={handleSave} 
        disabled={saving || saved}
        variant={saved ? "default" : error ? "destructive" : "outline"}
        size="sm"
      >
        {saving ? (
          <>
            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-current" />
            Saving...
          </>
        ) : saved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Saved to Dashboard
          </>
        ) : error ? (
          <>
            Save Failed - Retry
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Snippet
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive mt-1 max-w-xs text-right">
          {error}
        </p>
      )}
    </div>
  );
}