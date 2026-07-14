"use client";

import * as React from "react";
import { Button } from "./button";
import { X } from "lucide-react";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 mb-4">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
      {children}
    </h2>
  );
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">{children}</p>
  );
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AlertDialogAction({
  children,
  className = "",
  ...props
}: AlertDialogActionProps) {
  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  );
}

export function AlertDialogCancel({
  children,
  ...props
}: AlertDialogActionProps) {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
}
