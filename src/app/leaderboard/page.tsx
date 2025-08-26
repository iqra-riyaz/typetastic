import LeaderboardTable from "@/components/LeaderboardTable";
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto fade-in">
        <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Leaderboard</h1>
        <Card className="shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl">
            <CardContent className="p-0">
                <LeaderboardTable />
            </CardContent>
        </Card>
    </div>
  );
}
