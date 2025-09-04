import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/auth/api-auth";
import { GenerateResponse } from "@/types/snippet";
import { z } from "zod";

const generateRequestSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().optional(),
});

const SYSTEM_PROMPT = `You are an expert at creating SEO-optimized content for code snippets.

Given a code snippet, you must:
1. Generate an SEO-friendly title that includes the programming language and main functionality
2. Create a meta description under 160 characters that's compelling for search results
3. Write a clear explanation paragraph that helps developers understand the code
4. Generate proper JSON-LD structured data for the code snippet

Return STRICT JSON only matching this TypeScript type:
{
  "title": string,
  "description": string,
  "explanation": string,
  "html_output": string,
  "schema_markup": object
}

The html_output should include the code with syntax highlighting and the explanation.
The schema_markup should be valid JSON-LD structured data for a code snippet.`;

function buildUserPrompt(code: string, language?: string) {
  return `Code snippet to optimize (language: ${language || "auto-detect"}):

\`\`\`${language || ""}
${code}
\`\`\`

Generate SEO-optimized content with:
- Title: Include the language and what the code does (e.g., "React useEffect Hook Example for API Data Fetching")
- Description: Compelling meta description under 160 chars
- Explanation: 1-2 paragraph explanation of what the code does and how to use it
- HTML: Full HTML with syntax-highlighted code and explanation
- Schema: JSON-LD structured data for the code snippet

Return only JSON matching the required format.`;
}

export async function POST(req: NextRequest) {
  try {
    // Public endpoint - no auth required for generation, but track user if available
    await getApiUser();
    
    const body = await req.json().catch(() => ({}));
    const parseResult = generateRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return Response.json({ 
        error: "Invalid request data", 
        details: parseResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { code, language } = parseResult.data;

    const key = process.env.CLAUDE_KEY;
    const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";
    
    if (!key) {
      return Response.json({ error: "Server missing CLAUDE_KEY" }, { status: 500 });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: buildUserPrompt(code, language) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ 
        error: `Claude API error ${res.status}`, 
        details: text 
      }, { status: res.status });
    }

    const data = await res.json();
    const text: string | undefined = data?.content?.[0]?.text;
    
    if (!text) {
      return Response.json({ error: "Claude returned empty response" }, { status: 502 });
    }

    let parsed: GenerateResponse | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json({ 
        error: "Claude returned non-JSON", 
        raw: text 
      }, { status: 502 });
    }

    return Response.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ 
      error: "Unexpected error", 
      details: message 
    }, { status: 500 });
  }
}