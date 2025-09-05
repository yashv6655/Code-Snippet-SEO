import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'

const GITHUB_API_BASE = 'https://api.github.com'

interface ContextualGenerateRequest {
  code: string
  language?: string
  githubUrl?: string
}

async function fetchGitHubRepoContext(githubUrl: string) {
  try {
    const url = new URL(githubUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    if (pathParts.length < 2) {
      throw new Error('Invalid GitHub URL format')
    }

    const [owner, name] = pathParts
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Context-Aware-Code-SEO-Generator'
    }

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Fetch repository metadata
    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}`, { headers })
    if (!repoResponse.ok) {
      console.error('GitHub API error:', repoResponse.status)
      return null
    }
    const repoData = await repoResponse.json()

    // Fetch README content
    let readmeContent = ''
    try {
      const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}/readme`, { headers })
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json()
        if (readmeData.content && readmeData.encoding === 'base64') {
          readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8')
        }
      }
    } catch (error) {
      console.log('Could not fetch README:', error)
    }

    // Fetch package.json if available
    let packageJson = null
    try {
      const packageResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}/contents/package.json`, { headers })
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        if (packageData.content && packageData.encoding === 'base64') {
          const packageContent = Buffer.from(packageData.content, 'base64').toString('utf-8')
          packageJson = JSON.parse(packageContent)
        }
      }
    } catch (error) {
      console.log('Could not fetch package.json:', error)
    }

    return {
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || '',
      stars: repoData.stargazers_count || 0,
      topics: repoData.topics || [],
      readme: readmeContent.substring(0, 2000), // Limit README content
      packageJson: packageJson ? JSON.stringify(packageJson).substring(0, 1000) : null,
      owner,
      fullName: repoData.full_name
    }
  } catch (error) {
    console.error('Error fetching GitHub context:', error)
    return null
  }
}

async function generateContextualSEO(code: string, language?: string, repoContext?: any) {
  const contextInfo = repoContext ? `

REPOSITORY CONTEXT:
- Project: ${repoContext.name}
- Description: ${repoContext.description}
- Language: ${repoContext.language}
- Stars: ${repoContext.stars}
- Topics: ${repoContext.topics.join(', ')}
- Owner: ${repoContext.owner}
- README excerpt: ${repoContext.readme.substring(0, 500)}
${repoContext.packageJson ? `- Package.json: ${repoContext.packageJson.substring(0, 300)}` : ''}` : ''

  const prompt = `You are an expert technical writer and SEO specialist. Create SEO-optimized content for this code snippet with ${repoContext ? 'full repository context' : 'no additional context'}.

CODE SNIPPET:
\`\`\`${language || 'auto'}
${code}
\`\`\`
${contextInfo}

Generate comprehensive SEO content that:
1. Focuses on the specific code snippet provided
2. ${repoContext ? 'Uses repository context to provide better understanding of the code\'s purpose and usage' : 'Analyzes the code to determine its likely purpose and usage patterns'}
3. Targets developer search queries
4. Includes practical examples and use cases
5. Creates content that developers would actually find helpful

Return a JSON response with this exact structure:
{
  "title": "SEO-optimized title (focus on what the code does, include framework/library names if relevant)",
  "description": "Meta description for search results (150-160 chars, developer-focused)",
  "explanation": "Detailed explanation of what the code does, how it works, and when to use it. Include context about the project if available. Make it educational and helpful for developers.",
  "html_output": "Complete HTML page with proper structure, the code snippet, explanation, and usage examples. Include proper heading hierarchy and semantic markup.",
  "schema_markup": {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "name": "Article title",
    "description": "Article description",
    "programmingLanguage": "${language || 'Unknown'}",
    "codeRepository": ${repoContext ? `"https://github.com/${repoContext.fullName}"` : 'null'},
    "author": {
      "@type": ${repoContext ? '"Organization"' : '"Person"'},
      "name": ${repoContext ? `"${repoContext.owner}"` : '"Developer"'}
    }
  }
}`

  try {
    if (!process.env.CLAUDE_KEY) {
      throw new Error('Claude API key not configured')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Claude API error:', response.status, errorData)
      throw new Error(`Claude API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.content?.[0]?.text

    if (!content) {
      throw new Error('No content returned from Claude')
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('Claude response:', content.substring(0, 500))
      throw new Error('Invalid JSON response from Claude')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error generating contextual SEO:', error)
    
    // Enhanced fallback based on context
    const title = repoContext 
      ? `${repoContext.name} Code Example - ${language || 'Programming'} Implementation`
      : `${language || 'Code'} Example - Implementation Guide`
    
    const description = repoContext
      ? `Learn how to use this ${language || 'code'} example from ${repoContext.name}. ${repoContext.description.substring(0, 80)}`
      : `Understand this ${language || 'code'} snippet with detailed explanation and usage examples.`

    const explanation = repoContext
      ? `This code snippet is from ${repoContext.name}, ${repoContext.description}. The code demonstrates ${language || 'programming'} functionality within the context of this ${repoContext.language} project with ${repoContext.stars} stars on GitHub.`
      : `This ${language || 'code'} snippet demonstrates programming functionality. The code can be used as a reference for similar implementations in your projects.`

    return {
      title,
      description,
      explanation,
      html_output: `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>${title}</title>
    <meta name="description" content="${description}">
</head>
<body>
    <article>
        <header>
            <h1>${title}</h1>
            ${repoContext ? `<p>From: <a href="https://github.com/${repoContext.fullName}">${repoContext.name}</a></p>` : ''}
        </header>
        
        <section>
            <h2>Code Example</h2>
            <pre><code class="language-${language || 'text'}">${code}</code></pre>
        </section>
        
        <section>
            <h2>Explanation</h2>
            <p>${explanation}</p>
        </section>
        
        ${repoContext ? `
        <section>
            <h2>Project Context</h2>
            <p><strong>Repository:</strong> ${repoContext.name}</p>
            <p><strong>Description:</strong> ${repoContext.description}</p>
            <p><strong>Language:</strong> ${repoContext.language}</p>
            <p><strong>GitHub:</strong> <a href="https://github.com/${repoContext.fullName}">View Repository</a></p>
        </section>
        ` : ''}
    </article>
</body>
</html>`,
      schema_markup: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "name": title,
        "description": description,
        "programmingLanguage": language || 'Unknown',
        "codeRepository": repoContext ? `https://github.com/${repoContext.fullName}` : null,
        "author": {
          "@type": repoContext ? "Organization" : "Person",
          "name": repoContext ? repoContext.owner : "Developer"
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireApiAuth()
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    const body: ContextualGenerateRequest = await request.json()
    const { code, language, githubUrl } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Code snippet is required' },
        { status: 400 }
      )
    }

    // Fetch repository context if URL provided
    let repoContext = null
    if (githubUrl) {
      repoContext = await fetchGitHubRepoContext(githubUrl)
    }

    // Generate SEO content with context
    const result = await generateContextualSEO(code, language, repoContext)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Generate with context error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate SEO content'
      },
      { status: 500 }
    )
  }
}