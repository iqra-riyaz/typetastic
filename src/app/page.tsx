import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flame, BarChart, Keyboard, Moon, Users, Trophy } from 'lucide-react';
import TypetasticLogo from '@/components/TypetasticLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientProfileSelector from '@/components/ClientProfileSelector'; // Use the client wrapper
import { ThemeToggle } from '@/components/ThemeToggle';


const features = [
  {
    icon: <Keyboard size={24} className="text-primary" />,
    title: 'Practice Modes',
    description: 'Random Words, Sentences, or Custom Input.',
  },
  {
    icon: <BarChart size={24} className="text-primary" />,
    title: 'Performance Tracking',
    description: 'WPM, Accuracy, and Error graphs per profile.',
  },
  {
    icon: <Flame size={24} className="text-primary" />,
    title: 'Daily Streaks',
    description: 'Build consistency with daily practice sessions.',
  },
  {
    icon: <Trophy size={24} className="text-primary" />,
    title: 'Leaderboard',
    description: 'Compete with friends and family on the same computer.',
  },
  {
    icon: <Moon size={24} className="text-primary" />,
    title: 'Dark Mode & Themes',
    description: 'A sleek look that adapts to your vibe.',
  },
    {
    icon: <Users size={24} className="text-primary" />,
    title: 'Profiles',
    description: 'Create multiple profiles to track individual progress.',
  },
];


export default function LandingPage() {
  return (
    <div className="relative h-full flex flex-col items-center justify-start text-center p-4 fade-in overflow-auto">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <main className="flex flex-col items-center justify-center gap-6 z-10 min-h-screen pt-12 pb-12">
        <div className="scale-150 mb-4 mt-12">
          <TypetasticLogo />
        </div>
        
        <div className="flex flex-col items-center gap-4 mt-8">
            <ClientProfileSelector />
        </div>
      </main>

      <section className="w-full max-w-5xl mx-auto py-12 px-4 z-10">
        <h2 className="text-3xl font-bold text-center mb-8">
            <span role="img" aria-label="sparkles">⚡</span> Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <Card key={index} className="text-left shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                        {feature.icon}
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

       <footer className="w-full p-4 z-10 mt-auto">
         <p className="text-center text-muted-foreground">Made with ❤️ for better typing</p>
      </footer>

    </div>
  );
}
