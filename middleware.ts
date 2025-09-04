import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if required environment variables are present
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables - auth middleware disabled')
    // In development, still enforce some basic protection
    const pathname = request.nextUrl.pathname
    const isHomePage = pathname === '/'
    const isDashboard = pathname.startsWith('/dashboard')
    const isProtectedPath = isHomePage || isDashboard
    const isAuthPath = pathname.startsWith('/auth/')
    
    // Even without Supabase, redirect to login for protected paths in development
    if (isProtectedPath && !isAuthPath) {
      console.log('Development: Redirecting to login due to missing Supabase config')
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') ||
      pathname === '/favicon.ico') {
    return supabaseResponse
  }

  try {
    // Refresh session if expired
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Auth error in middleware:', error.message)
    }

    const isAuthPath = pathname.startsWith('/auth/')
    const isHomePage = pathname === '/'
    const isDashboard = pathname.startsWith('/dashboard')
    const isProtectedPath = isHomePage || isDashboard

    // Redirect unauthenticated users away from protected routes
    if (isProtectedPath && !user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPath && user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // Continue without authentication checks if there's an error
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}