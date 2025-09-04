import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/providers/analytics-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Snippet SEO Generator - Turn Code Examples Into SEO Content",
  description: "Generate SEO-optimized content from your code snippets. Create search-friendly titles, descriptions, and structured data that help developers find your examples.",
  keywords: ["code snippets", "seo", "developer tools", "technical content", "structured data", "code examples"],
  authors: [{ name: "Code Snippet SEO Generator" }],
  openGraph: {
    title: "Code Snippet SEO Generator",
    description: "Turn your code examples into search-optimized content that ranks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AnalyticsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}