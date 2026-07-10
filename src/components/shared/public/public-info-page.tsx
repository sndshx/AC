import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PublicInfoPageProps = {
  badge: string;
  title: string;
  description: string;
  items: string[];
};

export function PublicInfoPage({ badge, title, description, items }: PublicInfoPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <div className="mt-12 max-w-3xl">
          <Badge tone="info">{badge}</Badge>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item} className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
