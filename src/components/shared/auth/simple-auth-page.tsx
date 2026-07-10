"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";

type SimpleAuthPageProps = {
  mode: "forgot" | "reset";
};

export function SimpleAuthPage({ mode }: SimpleAuthPageProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode === "forgot" ? "forgot-password" : "reset-password"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const data = await response.json();
    setLoading(false);
    showToast({
      title: response.ok ? "Request received" : "Request failed",
      description: data.message ?? data.error,
      tone: response.ok ? "success" : "error"
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/45 px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
        <Card className="p-6">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <Send className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">{mode === "forgot" ? "Forgot Password" : "Reset Password"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot" ? "Enter your email and the API will accept a reset request." : "Submit a reset token and new password when your email provider is connected."}
          </p>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input name="email" type="email" placeholder="you@company.com" className="pl-10" required />
            </div>
            {mode === "reset" ? (
              <>
                <Input name="token" placeholder="Reset token" required />
                <Input name="password" type="password" placeholder="New password" required />
              </>
            ) : null}
            <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
