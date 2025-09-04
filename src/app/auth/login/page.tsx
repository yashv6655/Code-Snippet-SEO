import { LoginForm } from "@/components/auth/login-form";
import { Code } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors">
            <Code className="w-8 h-8" />
            Code Snippet SEO
          </Link>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}