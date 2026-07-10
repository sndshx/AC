"use client";

import { useToast } from "@/components/providers/toast-provider";
import { Mail, LockKeyhole, UserRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterCard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  function checkStrength(password: string) {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setPasswordStrength(s);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      showToast({ title: "Password mismatch", description: "Passwords do not match.", tone: "error" });
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast({ title: "Registration failed", description: data.error, tone: "error" });
      setIsLoading(false);
      return;
    }

    showToast({ title: "Account created!", description: "Your dashboard is ready." });
    router.replace(data.redirectTo ?? "/user/dashboard");
  }

  const strengthLabel = passwordStrength <= 1 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong";
  const strengthColor = passwordStrength <= 1 ? "#ef4444" : passwordStrength <= 3 ? "#f59e0b" : "#16a34a";

  return (
    <div className="ac-root">
      <div className="ac-card">

        {/* Logo */}
        <div className="ac-logo-header">
          <Link href="/" className="ac-logo">
            <div className="ac-logo-badge">AC</div>
            <span className="ac-logo-name">AI<strong>Marketing</strong></span>
          </Link>
        </div>

        {/* Body */}
        <div className="ac-body">
          <div className="ac-tabs">
            <Link href="/login" className="ac-tab">Login</Link>
            <span className="ac-tab ac-tab-active">Sign up</span>
          </div>

          <h1 className="ac-title">Create account</h1>
          <p className="ac-sub">Sign up to get started</p>

          <form onSubmit={submit} className="ac-form">
            <div className="ac-field">
              <span className="ac-field-icon"><UserRound className="ac-ic" /></span>
              <input id="fullName" name="fullName" type="text"
                placeholder="Full name" className="ac-input" required />
            </div>

            <div className="ac-field">
              <span className="ac-field-icon"><Mail className="ac-ic" /></span>
              <input id="email" name="email" type="email"
                placeholder="Email address" className="ac-input" required />
            </div>

            <div className="ac-field-group">
              <div className="ac-field">
                <span className="ac-field-icon"><LockKeyhole className="ac-ic" /></span>
                <input id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 chars)"
                  className="ac-input"
                  onChange={(e) => checkStrength(e.target.value)}
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="ac-eye" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="ac-ic" /> : <Eye className="ac-ic" />}
                </button>
              </div>
              {passwordStrength > 0 && (
                <div className="ac-strength-row">
                  <div className="ac-strength-bar">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <div key={l} className="ac-strength-seg"
                        style={{ background: l <= passwordStrength ? strengthColor : "#e5e7eb" }} />
                    ))}
                  </div>
                  <span className="ac-strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="ac-field">
              <span className="ac-field-icon"><LockKeyhole className="ac-ic" /></span>
              <input id="confirmPassword" name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className="ac-input" required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="ac-eye" aria-label="Toggle confirm">
                {showConfirm ? <EyeOff className="ac-ic" /> : <Eye className="ac-ic" />}
              </button>
            </div>

            <label className="ac-terms-row">
              <input type="checkbox" required className="ac-terms-check" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="ac-link">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="ac-link">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="ac-submit" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create Account"}
            </button>
          </form>

          <p className="ac-footer-text">
            Already have an account? <Link href="/login" className="ac-link">Login</Link>
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
        .ac-logo { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; }
        .ac-logo-badge {
          width: 32px; height: 32px; border-radius: 8px;
          background: #16a34a;
          display: flex; align-items: center; justify-content: center;
          color: #ffffff; font-size: 0.8rem; font-weight: 800; letter-spacing: -0.5px;
        }
        .ac-logo-name { font-size: 0.92rem; color: #0f172a; font-weight: 400; }
        .ac-logo-name strong { font-weight: 800; }

        .ac-body { padding: 1.75rem 2rem 1.5rem; }
        
        @media (max-width: 640px) {
          .ac-body { 
            padding: 1.5rem 1.25rem 1.25rem;
          }
        }

        .ac-tabs { 
          display: flex; 
          gap: 0; 
          margin-bottom: 1.25rem; 
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
            margin-bottom: 1rem;
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

        .ac-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; }
        .ac-sub { font-size: 0.83rem; color: #6b7570; margin-bottom: 1.25rem; }
        
        @media (max-width: 640px) {
          .ac-title { 
            font-size: 1.2rem;
            text-align: center;
          }
          .ac-sub { 
            font-size: 0.8rem;
            text-align: center;
            margin-bottom: 1rem;
          }
        }

        .ac-form { display: flex; flex-direction: column; gap: 0.9rem; }
        .ac-field-group { display: flex; flex-direction: column; gap: 0.4rem; }

        .ac-field {
          display: flex; align-items: center; gap: 0.6rem;
          border: 1px solid #dfe6e2; border-radius: 10px;
          padding: 0.1rem 0.85rem;
        }
        .ac-field:focus-within { border-color: #22c55e; }
        .ac-field-icon { display: flex; color: #8a9a92; flex-shrink: 0; }
        .ac-ic { width: 15px; height: 15px; }
        .ac-input {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 0.6rem 0; font-size: 0.85rem; color: #0f172a;
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
            padding: 0.08rem 0.75rem;
          }
          .ac-input {
            padding: 0.58rem 0; 
            font-size: 0.82rem;
          }
          .ac-ic { width: 14px; height: 14px; }
        }

        .ac-strength-row { display: flex; align-items: center; gap: 0.5rem; }
        .ac-strength-bar { display: flex; gap: 3px; flex: 1; }
        .ac-strength-seg { height: 3px; flex: 1; border-radius: 99px; }
        .ac-strength-label { font-size: 0.7rem; font-weight: 700; white-space: nowrap; }

        .ac-terms-row {
          display: flex; align-items: flex-start; gap: 0.55rem;
          font-size: 0.76rem; color: #5b6b63; cursor: pointer; line-height: 1.4;
        }
        .ac-terms-check { margin-top: 2px; accent-color: #22c55e; flex-shrink: 0; }
        
        @media (max-width: 640px) {
          .ac-terms-row {
            font-size: 0.74rem;
            gap: 0.5rem;
          }
        }

        .ac-submit {
          border: none; cursor: pointer;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem; font-weight: 700; color: #ffffff;
          background: #22c55e;
        }
        .ac-submit:hover:not(:disabled) { background: #16a34a; }
        .ac-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 640px) {
          .ac-submit {
            padding: 0.7rem 1rem;
            font-size: 0.85rem;
          }
        }

        .ac-footer-text {
          text-align: center; margin-top: 1.25rem; font-size: 0.83rem; color: #6b7570;
        }
        .ac-link { color: #16a34a; font-weight: 700; text-decoration: none; }
        .ac-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}