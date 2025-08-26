
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, Star, AreaChart } from 'lucide-react';
import { Area, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSettings } from '@/contexts/SettingsContext';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generatePracticeText } from '@/lib/text-generator';
import { useProfile } from '@/contexts/ProfileContext';

const TypingTutor = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const { currentProfile, updateCurrentProfileData, calculateScore } = useProfile();
  const { toast } = useToast();
  
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [score, setScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loadingText, setLoadingText] = useState(true);
  const [metricsToRecord, setMetricsToRecord] = useState<{wpm: number, accuracy: number, errors: number, score: number} | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAndSetText = useCallback(() => {
    if (settingsLoading) return;
    setLoadingText(true);
    setInput('');
    const newText = generatePracticeText(settings);
    setText(newText.text);
    setLoadingText(false);
    setIsFinished(false);
  }, [settings, settingsLoading]);

  const resetGame = useCallback(() => {
    fetchAndSetText();
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    setScore(0);
    setIsTyping(false);
    setIsFinished(false);
    setMetricsToRecord(null); // Clear recorded metrics
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [fetchAndSetText]);

  useEffect(() => {
    if (!settingsLoading) {
        // Instead of resetting the entire game, just fetch and set new text
        // Metrics will be reset by handlePlayAgain when user chooses
        fetchAndSetText();
    }
  }, [fetchAndSetText, settingsLoading, settings.difficulty, settings.textSource, settings.customText]);

  useEffect(() => {
    setScore(calculateScore(wpm, accuracy, errors));
  }, [wpm, accuracy, errors, calculateScore]); // This useEffect is fine, it only updates score based on other metrics
  
  useEffect(() => {
    if (isTyping && !isFinished && startTime) {
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length;
        const currentWpm = elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0;
        setWpm(currentWpm);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTyping, isFinished, startTime, input]);

  // When a round is finished, calculate final metrics and store them for potential recording
  useEffect(() => {
    if (isFinished && currentProfile) {
      const finalWpm = wpm;
      const finalAccuracy = accuracy;
      const finalErrors = errors;
      const finalScore = calculateScore(finalWpm, finalAccuracy, finalErrors);
      
      setMetricsToRecord({ // Store metrics, but don't record yet
        wpm: finalWpm,
        accuracy: finalAccuracy,
        errors: finalErrors,
        score: finalScore,
      });

      toast({
        title: "Good Job!",
        description: `You typed at ${finalWpm} WPM with ${finalAccuracy.toFixed(1)}% accuracy.`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isFinished, wpm, accuracy, errors, calculateScore, currentProfile, toast]); // Added dependencies for clarity and correctness

  const handlePlayAgain = useCallback(() => {
    if (metricsToRecord && currentProfile) {
      updateCurrentProfileData(metricsToRecord);
    }
    resetGame();
  }, [metricsToRecord, currentProfile, updateCurrentProfileData, resetGame]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(Date.now());
    }
    
    if (isFinished) return; // Prevent input after completion

    setInput(value);

    let currentErrors = 0;
    const newTextSlice = text.slice(0, value.length);
    value.split('').forEach((char, i) => {
        if (char !== newTextSlice[i]) {
            currentErrors++;
        }
    });
    setErrors(currentErrors);
    setAccuracy(value.length > 0 ? Math.max(0, ((value.length - currentErrors) / value.length) * 100) : 0);

    if (value.length >= text.length) {
      setIsFinished(true);
      setIsTyping(false);
      // Ensure that current WPM calculation stops here as well
      setWpm(prevWpm => prevWpm); // Freeze WPM at its current value
    }
  };

  const renderText = () => {
    if (loadingText) {
      return <Skeleton className="h-20 w-full" />
    }
     if (!text) {
      return <div className="text-center text-muted-foreground p-8">Your custom text is empty. Please add some text in the settings page.</div>
    }

    return text.split('').map((char, index) => {
      let colorClass = 'text-muted-foreground/60';
      if (index < input.length) {
        colorClass = char === input[index] ? 'text-foreground' : 'text-destructive';
      }
      const isCurrent = index === input.length;
      return (
        <span key={index} className={`${colorClass} ${isCurrent ? 'border-b-2 border-primary' : ''} transition-colors duration-100`}>
          {char}
        </span>
      );
    });
  };
  
  const chartConfig = {
    score: { label: "Score", color: "hsl(var(--chart-1))", icon: AreaChart },
  };

  // Use the profile from context directly to ensure it's the latest version
  const history = currentProfile?.performanceHistory || [];
  
  const chartData = history.map((entry, i) => ({
    name: `#${i + 1}`,
    score: entry.score,
    wpm: entry.wpm,
    accuracy: parseFloat(entry.accuracy.toFixed(1)), // Ensure accuracy is formatted as a number
    errors: entry.errors,
  })).slice(-10);

  return (
    <div className="w-full max-w-4xl space-y-8 fade-in">
      <Card className="shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl">
        <CardContent className="p-6">
          <div 
            className="text-2xl font-code tracking-wider leading-relaxed cursor-text select-none min-h-[80px]"
            onClick={() => inputRef.current?.focus()}
          >
            {renderText()}
          </div>
          <input
            ref={inputRef}
            id="typing-input"
            name="typing-input"
            type="text"
            value={input}
            onChange={handleInputChange}
            className="opacity-0 absolute w-0 h-0"
            autoFocus
            disabled={isFinished || loadingText || !text}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{title: 'Score', value: score, icon: Star}, {title: 'WPM', value: wpm}, {title: 'Accuracy', value: `${accuracy.toFixed(0)}%`}, {title: 'Errors', value: errors, isDestructive: true}].map(stat => (
            <Card key={stat.title} className="shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${stat.isDestructive ? 'text-destructive' : 'text-primary'}`}>{stat.value}</div>
              </CardContent>
            </Card>
        ))}
      </div>

      <div className="text-center">
          <Button onClick={handlePlayAgain} size="lg" className="shadow-subtle" disabled={loadingText || settingsLoading}>
              {loadingText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {loadingText ? 'Generating...' : isFinished ? 'Play Again' : 'New Text'}
          </Button>
      </div>

      <Card className="shadow-subtle dark:shadow-subtle-dark transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl">
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your overall score for the last 10 tests for profile: <span className="font-bold text-primary">{currentProfile?.username}</span></CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer>
                  <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip 
                      content={<ChartTooltipContent 
                        indicator="dot" 
                        labelClassName="text-background"
                        className="bg-foreground text-background"
                        formatter={(value: any, name: string) => {
                          if (name === "accuracy") return `${value}%`;
                          return value;
                        }}
                        itemSorter={(item: { dataKey: string; }) => {
                          // Custom sort order for tooltip items
                          const order: { [key: string]: number } = { score: 1, wpm: 2, accuracy: 3, errors: 4 };
                          return order[item.dataKey] || 99;
                        }}
                      />} 
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="score"
                        fill="url(#fillScore)"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={true}
                    />
                    <Area 
                      type="monotone"
                      dataKey="wpm"
                      fill="transparent"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={true}
                      hide={true} // Hidden by default, only visible on tooltip
                    />
                    <Area 
                      type="monotone"
                      dataKey="accuracy"
                      fill="transparent"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={true}
                      hide={true} // Hidden by default, only visible on tooltip
                    />
                     <Area 
                      type="monotone"
                      dataKey="errors"
                      fill="transparent"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={true}
                      hide={true} // Hidden by default, only visible on tooltip
                    />
                  </ComposedChart>
               </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
};

export default TypingTutor;
