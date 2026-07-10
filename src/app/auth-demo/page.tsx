import { LoginCard } from "@/components/shared/auth/login-card";
import { RegisterCard } from "@/components/shared/auth/register-card";
import Link from "next/link";

export default function AuthDemoPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Auth Pages Demo</h1>
          <p className="text-slate-600 mb-6">
            Updated login and register pages with your color theme
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: 'hsl(var(--primary))', 
                color: 'hsl(var(--primary-foreground))' 
              }}
            >
              View Login Page
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: 'hsl(var(--primary))', 
                color: 'hsl(var(--primary-foreground))' 
              }}
            >
              View Register Page
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Login Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-slate-800">Login Page</h2>
            <div className="transform scale-75 origin-top">
              <LoginCard />
            </div>
          </div>

          {/* Register Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-slate-800">Register Page</h2>
            <div className="transform scale-75 origin-top">
              <RegisterCard />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}