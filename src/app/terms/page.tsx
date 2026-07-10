import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Send } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-6 py-10 max-w-4xl">
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Article Craft, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of Article Craft per device for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Article Craft are provided on an 'as is' basis. Article Craft makes no warranties, expressed or implied.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Article Craft or its suppliers be liable for any damages arising out of the use or inability to use the materials.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at legal@articlecraft.com
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Last updated: July 9, 2026
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}