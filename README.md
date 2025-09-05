# Context-Aware Code SEO Generator

> AI-powered SEO content generation tool that combines specific code snippets with repository context to create targeted, developer-focused content that ranks in search engines.

## Overview

Context-Aware Code SEO Generator is a full-stack web application that transforms code snippets into SEO-optimized content by understanding both the specific code example and the broader project context. Built specifically for Sita's ICP of developer-tool companies seeking to capture high-intent developer searches with contextually-rich, technical content.

## Architecture Requirements Addressed

### ETL (Extract, Transform, Load)
- **Extract**: Code snippet input with optional GitHub repository context via intuitive form interfaces
- **Transform**: AI-powered content generation using Anthropic Claude API with repository-aware SEO optimization
- **Load**: Persistent storage in Supabase PostgreSQL with structured data models for snippets and context

### Full-Stack Implementation
- **Frontend**: Next.js 15 with React Server Components and TypeScript
- **Backend**: Next.js API routes with GitHub API integration and server-side authentication
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with middleware-based route protection

### Internet Deployment Ready
- **Framework**: Next.js 15 optimized for Vercel deployment
- **Database**: Cloud-hosted Supabase instance
- **Environment**: Production-ready with environment variable configuration
- **Build**: TypeScript compilation with optimized bundle size

### Database Integration
- **Primary DB**: PostgreSQL via Supabase
- **Schema**: Normalized tables for users, snippets, and repository context
- **Security**: Row Level Security (RLS) policies for data isolation
- **Performance**: Indexed queries and optimized data relationships

### Security Implementation
- **Authentication**: JWT-based session management via Supabase
- **Authorization**: User-scoped data access with RLS policies
- **Route Protection**: Middleware-based authentication checks
- **Data Validation**: Zod schema validation on API endpoints
- **Environment Security**: Secure API key management

### Sita ICP Alignment
**Target Audience**: Developer-tool companies and technical decision makers
**Value Proposition**: 
- Creates context-aware SEO content that combines specific code examples with project understanding
- Captures high-intent developer searches with targeted, technical content
- Reduces content creation overhead for developer relations teams
- Provides structured data markup for rich search results with repository context
- Delivers analytics insights for content performance optimization

### Beautiful Design
- **UI Framework**: Tailwind CSS with Radix UI components
- **Design System**: Consistent spacing, typography, and color schemes
- **Responsive**: Mobile-first design with adaptive layouts
- **UX**: Intuitive form flows with real-time validation and feedback

### Analytics Enabled

**Platform**: PostHog for comprehensive behavioral analytics and product optimization

**Detailed Event Tracking**:

*Landing Page Analytics*:
- `landing_cta_clicked` - Tracks CTA interactions with context-aware messaging
- `feature_viewed` - Monitors repository context feature engagement
- `example_interaction` - Tracks code snippet example interactions

*Authentication Flow*:
- `auth_attempt` - Login/register attempts with method tracking
- `auth_success` - Successful authentication events
- `auth_error` - Authentication failures with error context

*Code Generation Funnel*:
- `snippet_with_context_generation_started` - Tracks usage of repository context feature
- `snippet_generation_completed` - Successful content generation with context metrics
- `snippet_copied` - Copy-to-clipboard usage for generated content
- `snippet_exported` - Export preferences (HTML, JSON formats)

*User Engagement*:
- `dashboard_action` - Dashboard usage patterns and snippet management
- `performance_metric` - API response times and generation latency
- `$pageview` - Page navigation tracking with custom page names

## Technology Choices & Reasoning

### Frontend Stack
- **Next.js 15**: Server-side rendering for SEO, built-in API routes, excellent TypeScript support
- **TypeScript**: Type safety for large-scale application development
- **Tailwind CSS**: Rapid UI development with consistent design system
- **Radix UI**: Accessible, unstyled components with keyboard navigation

### Backend & Database
- **Supabase**: PostgreSQL with real-time capabilities, built-in authentication, and RLS
- **Next.js API Routes**: Serverless functions for scalable backend logic
- **Zod**: Runtime type validation for API security and data integrity

### AI & Content Generation
- **Anthropic Claude**: Advanced language model optimized for context-aware technical content
- **GitHub API Integration**: Repository context extraction for enhanced content generation
- **Structured Output**: JSON-LD schema generation for search engine optimization

### Analytics & Monitoring
- **PostHog**: Developer-friendly analytics with event tracking and user behavior insights

## Development Process

1. **Requirements Analysis**: Identified key user workflows for context-aware code SEO generation
2. **Repository Integration**: Implemented GitHub API integration for repository context extraction
3. **Authentication Layer**: Implemented secure user authentication with route protection
4. **AI Integration**: Connected Anthropic Claude API with context-aware prompt engineering
5. **UI/UX Development**: Built responsive interface with code snippet and repository inputs
6. **Analytics Integration**: Added comprehensive event tracking for user behavior analysis
7. **Testing & Optimization**: Performance optimization and context extraction reliability

## Key Features

- **Context-Aware Generation**: Combines specific code snippets with repository context for targeted SEO content
- **Repository Integration**: GitHub API integration for automatic project context extraction
- **SEO Optimization**: Generates JSON-LD structured data for rich search results
- **User Management**: Secure authentication with personalized snippet history
- **Export Options**: Multiple format exports (HTML, JSON) for immediate implementation
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Business Impact for Sita's ICP

- **Context-Rich Content**: Creates SEO content that understands both specific code examples and project context
- **Search Visibility**: Improves organic search rankings for technical code examples
- **Developer Experience**: Intuitive interface designed for technical users with repository integration
- **Scalability**: Handles context-aware content generation for growing developer tool companies
- **Data Insights**: Analytics provide actionable insights for content strategy optimization
