"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Header } from "@/components/header";
import { SnippetDetailModal } from "@/components/snippet-detail-modal";
import { Button } from "@/components/ui/button";
import { Code, FileText, Calendar, Download, Trash2, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Snippet } from "@/types/snippet";

export default function DashboardPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSnippets();
    }
  }, [user]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/snippets');
      const data = await response.json();

      if (response.ok) {
        setSnippets(data.snippets || []);
      } else {
        setError(data.error || 'Failed to fetch snippets');
      }
    } catch (err) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSnippet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnippets(snippets.filter(snippet => snippet.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete snippet');
      }
    } catch (err) {
      setError('Failed to delete snippet');
      console.error('Error deleting snippet:', err);
    }
  };

  const downloadHTML = (snippet: Snippet) => {
    const blob = new Blob([snippet.html_output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card-modern p-8 text-center max-w-md">
          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your saved snippets.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showDashboardLink={false} />

      {/* Page Title */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Snippets</h1>
              <p className="text-muted-foreground">
                Manage your saved code snippet SEO content
              </p>
            </div>
            <Button asChild>
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                New Snippet
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredSnippets.length} of {snippets.length} snippets
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-modern p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSnippets.length === 0 && searchQuery === "" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No snippets yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first SEO-optimized code snippet to get started.
            </p>
            <Button asChild>
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Snippet
              </Link>
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && filteredSnippets.length === 0 && searchQuery !== "" && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              No snippets match "{searchQuery}". Try a different search term.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Snippets Grid */}
        {!loading && filteredSnippets.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets.map((snippet) => (
              <div 
                key={snippet.id} 
                className="card-modern p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedSnippet(snippet)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Code className="w-4 h-4 text-primary" />
                    </div>
                    {snippet.language && (
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {snippet.language}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSnippet(snippet.id);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {snippet.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {snippet.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  {new Date(snippet.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadHTML(snippet);
                    }}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const jsonData = {
                        title: snippet.title,
                        description: snippet.description,
                        explanation: snippet.explanation,
                        schema_markup: snippet.schema_markup,
                      };
                      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${snippet.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    JSON
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Snippet Detail Modal */}
        {selectedSnippet && (
          <SnippetDetailModal
            snippet={selectedSnippet}
            isOpen={!!selectedSnippet}
            onClose={() => setSelectedSnippet(null)}
          />
        )}
      </main>
    </div>
  );
}