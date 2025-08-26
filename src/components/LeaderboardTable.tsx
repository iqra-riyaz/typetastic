
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/contexts/ProfileContext";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import type { Profile } from "@/contexts/ProfileContext";

export default function LeaderboardTable() {
  const { profiles } = useProfile();
  const [sortedProfiles, setSortedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const getAverage = (arr: number[] = []) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
    const calculatedProfiles = Object.values(profiles)
      .map(p => ({
        ...p,
        avgAccuracy: getAverage(p.accuracyHistory || []),
        bestScore: p.bestScore || 0,
        bestWpm: p.bestWpm || 0,
        streak: p.streak || 0,
      }));

    calculatedProfiles.sort((a, b) => b.bestScore - a.bestScore);

    setSortedProfiles(calculatedProfiles);
  }, [profiles]);

  if (sortedProfiles.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No profiles have practiced yet. Create a profile and start typing to appear on the leaderboard!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Best Score</TableHead>
          <TableHead className="text-right">Best WPM</TableHead>
          <TableHead className="text-right">Avg. Accuracy</TableHead>
          <TableHead className="text-right">Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProfiles.map((profile, index) => (
          <TableRow key={profile.username} className="[&_td]:last:pr-6 [&_td]:first:pl-6 even:bg-muted/30">
            <TableCell className="font-bold text-lg text-primary">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback>{profile.username.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{profile.username}</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-bold text-lg">{profile.bestScore.toFixed(0)}</TableCell>
            <TableCell className="text-right">{profile.bestWpm.toFixed(0)}</TableCell>
            <TableCell className="text-right">{profile.avgAccuracy.toFixed(1)}%</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary" className="bg-accent/50 text-accent-foreground flex items-center justify-center gap-1 min-w-[40px]">
                {profile.streak} <Flame size={14} className="text-orange-500" />
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
