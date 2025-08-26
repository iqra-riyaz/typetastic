"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={toggleTheme}>
      {theme === "light" ? <Sun /> : <Moon />}
      <span className="group-data-[collapsible=icon]:hidden">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
    </Button>
  );
}
