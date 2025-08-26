"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useSettings } from "@/contexts/SettingsContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { settings, updateSetting, loading } = useSettings();

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl fade-in">
        <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Settings</h1>
        <Card className="shadow-subtle dark:shadow-subtle-dark">
            <CardHeader>
                <CardTitle>Appearance & Practice</CardTitle>
                <CardDescription>Customize the look and feel of your typing experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl fade-in">
        <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Settings</h1>
        <Card className="shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl">
            <CardHeader>
                <CardTitle>Appearance & Practice</CardTitle>
                <CardDescription>Customize the look and feel of your typing experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
                    <div>
                        <Label className="font-medium">Theme Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                    </div>
                    <ThemeSwitch />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
                    <div>
                        <Label htmlFor="difficulty" className="font-medium">Difficulty</Label>
                        <p className="text-sm text-muted-foreground">Choose the complexity of the text.</p>
                    </div>
                    <Select value={settings.difficulty} onValueChange={(value: "easy" | "medium" | "hard") => updateSetting('difficulty', value)}>
                      <SelectTrigger id="difficulty" className="w-[180px]">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">🌱 Beginner</SelectItem>
                        <SelectItem value="medium">⚡ Skilled</SelectItem>
                        <SelectItem value="hard">🚀 Master</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
                    <div>
                        <Label htmlFor="text-source" className="font-medium">Text Source</Label>
                        <p className="text-sm text-muted-foreground">Select the source of typing text.</p>
                    </div>
                     <Select value={settings.textSource} onValueChange={(value: "random" | "quotes" | "pangram" | "custom") => updateSetting('textSource', value)}>
                      <SelectTrigger id="text-source" className="w-[180px]">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random Words</SelectItem>
                        <SelectItem value="quotes">Quotes</SelectItem>
                        <SelectItem value="pangram">Pangram</SelectItem>
                        <SelectItem value="custom">Custom Input</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                {settings.textSource === 'custom' && (
                  <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                      <Label htmlFor="custom-text" className="font-medium">Custom Text</Label>
                      <p className="text-sm text-muted-foreground">Enter your own text to practice with.</p>
                      <Textarea
                        id="custom-text"
                        placeholder="Paste or type your text here..."
                        value={settings.customText}
                        onChange={(e) => updateSetting('customText', e.target.value)}
                        className="min-h-[120px] font-code"
                      />
                  </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
