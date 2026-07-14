"use client";

import { useToast } from "@/components/providers/toast-provider";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

export function LoginCard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const fd = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast({ title: "Login failed", description: data.error, tone: "error" });
      setIsLoading(false);
      return;
    }
    showToast({ title: "Welcome back!" });
    router.replace(data.redirectTo);
  }

  return (
    <div className="ac-root">
      <div className="ac-card">

        {/* Logo */}
        <div className="ac-logo-header">
          <Logo href="/" size="md" />
        </div>

        {/* Body */}
        <div className="ac-body">
          <div className="ac-tabs">
            <span className="ac-tab ac-tab-active">Login</span>
            <Link href="/register" className="ac-tab">Sign up</Link>
          </div>

          <h1 className="ac-title">Welcome back</h1>
          <p className="ac-sub">Login to access your dashboard</p>

          <form onSubmit={submit} className="ac-form">
            <div className="ac-field">
              <span className="ac-field-icon"><Mail className="ac-ic" /></span>
              <input id="email" name="email" type="email" placeholder="Email"
                className="ac-input" required />
            </div>

            <div className="ac-field">
              <span className="ac-field-icon"><Lock className="ac-ic" /></span>
              <input id="password" name="password" type={showPassword ? "text" : "password"}
                placeholder="Password" className="ac-input" required />
              <button type="button" className="ac-eye" aria-label="Toggle password"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="ac-ic" /> : <Eye className="ac-ic" />}
              </button>
            </div>

            <div className="ac-row">
              <Link href="/forgot-password" className="ac-forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="ac-submit" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="ac-footer-text">
            Don&apos;t have an account? <Link href="/register" className="ac-link">Sign up</Link>
          </p>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ac-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #f6f8f7;
          padding: 1rem;
        }

        .ac-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e7ece9;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06);
          width: 100%; max-width: 480px;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .ac-root { 
            padding: 0.75rem; 
            align-items: flex-start; 
            padding-top: 2rem;
          }
          .ac-card { 
            max-width: 100%;
            border-radius: 12px;
          }
        }

        .ac-logo-header {
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eef2f0;
        }
        
        @media (max-width: 640px) {
          .ac-logo-header { 
            padding: 1.25rem 1rem;
          }
        }

        .ac-body { padding: 2rem 2rem 1.75rem; }
        
        @media (max-width: 640px) {
          .ac-body { 
            padding: 1.5rem 1.25rem 1.25rem;
          }
        }

        .ac-tabs { 
          display: flex; 
          gap: 0; 
          margin-bottom: 1.5rem; 
          justify-content: center;
          background: #f8faf9;
          border-radius: 12px;
          padding: 4px;
          border: 1px solid #e7ece9;
        }
        .ac-tab {
          font-size: 0.9rem; font-weight: 700; color: #6b7570;
          text-decoration: none; 
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex: 1;
          text-align: center;
          min-width: 80px;
        }
        
        @media (max-width: 640px) {
          .ac-tabs { 
            margin-bottom: 1.25rem;
          }
          .ac-tab {
            font-size: 0.85rem;
            padding: 0.65rem 1rem;
          }
        }
        .ac-tab:hover { color: #16a34a; }
        .ac-tab-active { 
          color: #16a34a; 
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .ac-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem; }
        .ac-sub { font-size: 0.85rem; color: #6b7570; margin-bottom: 1.5rem; }
        
        @media (max-width: 640px) {
          .ac-title { 
            font-size: 1.25rem;
            text-align: center;
          }
          .ac-sub { 
            font-size: 0.82rem;
            text-align: center;
            margin-bottom: 1.25rem;
          }
        }

        .ac-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .ac-field {
          display: flex; align-items: center; gap: 0.65rem;
          border: 1px solid #dfe6e2; border-radius: 10px;
          padding: 0.15rem 0.9rem;
        }
        .ac-field:focus-within { border-color: #22c55e; }
        .ac-field-icon { display: flex; color: #8a9a92; flex-shrink: 0; }
        .ac-ic { width: 16px; height: 16px; }
        .ac-input {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 0.7rem 0; font-size: 0.88rem; color: #0f172a;
        }
        .ac-input::placeholder { color: #a4aca7; }
        
        /* Remove autocomplete blue background */
        .ac-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #0f172a !important;
          background-color: transparent !important;
        }
        .ac-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        .ac-input:-webkit-autofill:hover {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        .ac-eye { background: none; border: none; cursor: pointer; color: #8a9a92; display: flex; }
        .ac-eye:hover { color: #16a34a; }
        
        @media (max-width: 640px) {
          .ac-field {
            gap: 0.5rem;
            padding: 0.1rem 0.75rem;
          }
          .ac-input {
            padding: 0.65rem 0; 
            font-size: 0.85rem;
          }
          .ac-ic { width: 15px; height: 15px; }
        }

        .ac-row { display: flex; justify-content: flex-end; margin-top: -0.4rem; }
        .ac-forgot { font-size: 0.8rem; color: #16a34a; text-decoration: none; font-weight: 600; }
        .ac-forgot:hover { text-decoration: underline; }

        .ac-submit {
          border: none; cursor: pointer;
          border-radius: 10px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem; font-weight: 700; color: #ffffff;
          background: #22c55e;
        }
        .ac-submit:hover:not(:disabled) { background: #16a34a; }
        .ac-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 640px) {
          .ac-submit {
            padding: 0.75rem 1rem;
            font-size: 0.88rem;
          }
        }

        .ac-footer-text {
          text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #6b7570;
        }
        .ac-link { color: #16a34a; font-weight: 700; text-decoration: none; }
        .ac-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}