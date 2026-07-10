"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg border bg-card p-4 text-card-foreground shadow-soft",
              toast.tone === "error" ? "border-rose-300" : "border-border"
            )}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className={cn("mt-0.5 h-5 w-5", toast.tone === "error" ? "text-rose-500" : "text-emerald-500")} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p> : null}
              </div>
              <Button
                aria-label="Dismiss notification"
                title="Dismiss"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
