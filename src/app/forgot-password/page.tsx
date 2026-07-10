"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { showToast } from "@/lib/shared/toasts";
import { Mail, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const email = formData.get("email") as string;

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      showToast({ 
        title: "Reset link sent", 
        description: "Check your email for password reset instructions.",
        tone: "success" 
      });
    }, 1500);
  }

  if (emailSent) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
                <Send className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">Article Craft</span>
            </Link>
            <ThemeToggle />
          </div>

          <Card className="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Check Your Email</h1>
            <p className="text-muted-foreground mb-8">
              We&apos;ve sent password reset instructions to your email address. 
              Click the link in the email to reset your password.
            </p>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email?{" "}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">Article Craft</span>
          </Link>
          <ThemeToggle />
        </div>

        <Card className="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="pl-10 h-11 focus:ring-2 focus:ring-primary/20" 
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}