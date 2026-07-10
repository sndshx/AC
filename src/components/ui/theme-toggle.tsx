"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button aria-label="Toggle theme" title="Toggle theme" variant="ghost" size="icon" onClick={toggleTheme}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}
