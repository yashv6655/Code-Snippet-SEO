# Code Snippet SEO Generator

> Transform your code examples into search-optimized content that developers actually find

Turn any code snippet into SEO-friendly content with optimized titles, meta descriptions, explanations, and structured data. Built specifically for developer tool companies and technical content creators who want to capture "code example" search traffic.

## The SEO Opportunity

**Search Volume Examples:**
- "react useEffect example" - 50K+ monthly searches
- "express middleware example" - 25K+ searches  
- "python API request example" - 40K+ searches

**The Problem:** Great code examples get buried in documentation that doesn't rank well.

**The Solution:** Every code snippet becomes a search-ranking landing page that captures high-intent developer traffic.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start generating SEO content from your code snippets.

## How It Works (Simple Claude Wrapper)

1. **Input**: Paste any code snippet + optional language selection
2. **Claude AI Processing**: Generates SEO title, meta description, explanation, and JSON-LD schema
3. **Output**: Copy-paste ready HTML with structured data markup
4. **Export**: Download as HTML or JSON for immediate use

## What Gets Generated

For every code snippet, you get:

- **SEO Title**: "[Language] [Functionality] Example - [Clear Description]"
- **Meta Description**: Compelling <160 char description optimized for CTR
- **Explanation**: 1-2 paragraph breakdown of what the code does
- **HTML Output**: Syntax-highlighted code with proper formatting
- **JSON-LD Schema**: Structured data for rich search snippets

## Example Output

Input:
```javascript
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setData);
}, []);
```

Generated:
- **Title**: "React useEffect Hook Example for API Data Fetching"
- **Description**: "Learn how to fetch API data in React using useEffect hook with useState for state management. Complete working example included."
- **Schema**: Structured data markup for code snippet rich results

## Architecture Requirements Met

### ETL (Extract, Transform, Load)
- **Extract**: User code input via form interface
- **Transform**: Claude API processes and optimizes content
- **Load**: Optional save to Supabase for future reference

### Full-Stack Implementation
- **Frontend**: Next.js 15 with React Server Components
- **Backend**: Next.js API routes with Claude integration
- **Database**: Supabase PostgreSQL (optional saving)

### Sita ICP Alignment
**Target**: Developer tool companies needing SEO content at scale
**Value**: Converts expensive "hire content writers" into "paste code, get SEO content"
**Impact**: Captures thousands of "[tool] example" searches automatically

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **AI**: Claude API for content generation
- **Database**: Supabase PostgreSQL with RLS
- **Styling**: Tailwind CSS with Radix UI components
- **Analytics**: PostHog for usage tracking
- **Deployment**: Vercel-ready

## Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Add your keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLAUDE_KEY=your_claude_api_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key  # Optional
```

## Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run linting
```

## API Reference

### `POST /api/generate`

Generate SEO content from code snippet.

**Request:**
```json
{
  "code": "const example = 'Hello World';",
  "language": "javascript"  // optional
}
```

**Response:**
```json
{
  "title": "JavaScript Variable Declaration Example",
  "description": "Learn how to declare variables in JavaScript with const keyword...",
  "explanation": "This code demonstrates...",
  "html_output": "<div class=\"code-snippet\">...</div>",
  "schema_markup": { "@context": "https://schema.org", ... }
}
```

## Use Cases

 Developer Pain Point:

  "I'm trying to integrate Stripe payments / use React Query / implement auth with Supabase, but the official docs are either too basic or too complex. I need a real working example."

  Current Reality:

  - Developer googles "stripe payment integration example"

  - Gets Stack Overflow answers from 2019, random blog posts, or incomplete tutorials

  - Spends 2+ hours piecing together a working solution

  With Code Snippet SEO Generator:

  - Stripe (or any dev tool company) uses this tool to turn their internal code examples into search-optimized content

  - When developers search "stripe payment react example", they find Stripe's own optimized snippet that ranks #1

  - Developer gets the exact, current, official example they need in 30 seconds




## License

MIT License - Built for the developer community

---

**Perfect for Sita's ICP**: Helps developer tool companies capture technical search traffic without expensive content teams.