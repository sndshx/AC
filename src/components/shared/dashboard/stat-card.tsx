import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
  progress?: number;
  icon: LucideIcon;
  tone?: "success" | "warning" | "danger" | "info";
};

export function StatCard({ label, value, trend, progress, icon: Icon, tone = "info" }: StatCardProps) {
  const isNegative = trend?.startsWith("-");

  const getIconBgColor = () => {
    switch (tone) {
      case "success":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "danger":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      case "info":
      default:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-lg ${getIconBgColor()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between gap-3">
        {trend ? (
          <Badge 
            tone={isNegative ? "danger" : "success"}
            className="flex items-center gap-1 px-2 py-1"
          >
            {isNegative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {trend}
          </Badge>
        ) : (
          <span />
        )}
        {typeof progress === "number" ? (
          <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
        ) : null}
      </div>
      
      {typeof progress === "number" ? (
        <div className="mt-3">
          <Progress value={progress} className="h-2" />
        </div>
      ) : null}
    </Card>
  );
}
