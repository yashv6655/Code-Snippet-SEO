import { SignupForm } from "@/components/auth/signup-form";
import { Code } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
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

        <SignupForm />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            By creating an account, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}