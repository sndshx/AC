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
        return "bg-[#E8F7EE] text-[#143D2C] dark:bg-green-900/30 dark:text-green-400";
      case "warning":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "danger":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      case "info":
      default:
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getProgressColor = () => {
    switch (tone) {
      case "success": return "bg-[#00C853]";
      case "warning": return "bg-amber-500";
      case "danger": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <Card className="relative p-4 transition-all hover:shadow-md hover:border-[#00C853]/30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      {/* Top Row: label + icon */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
          {label}
        </p>
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${getIconBgColor()}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none mb-3">
        {value}
      </p>

      {/* Bottom Row: trend badge + progress % */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          {trend ? (
            <Badge
              tone={isNegative ? "danger" : "success"}
              className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold"
            >
              {isNegative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {trend}
            </Badge>
          ) : (
            <span />
          )}
          {typeof progress === "number" ? (
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{Math.round(progress)}%</span>
          ) : null}
        </div>

        {typeof progress === "number" ? (
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getProgressColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
