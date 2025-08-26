"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
