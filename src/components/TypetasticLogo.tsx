'use client';

import { useTheme } from "./providers/ThemeProvider";

const KeyboardKeyIcon = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gradientId = "keyboard-key-gradient";
  const filterId = "key-glow";

  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? 'hsl(240, 50%, 75%)' : 'hsl(240, 50%, 65%)'} />
          <stop offset="100%" stopColor={isDark ? 'hsl(350, 90%, 80%)' : 'hsl(350, 90%, 70%)'} />
        </linearGradient>
         <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
      </defs>
      <g style={{ filter: isDark ? `url(#${filterId})` : 'none' }}>
        <rect x="6" y="14" width="36" height="20" rx="4" fill={`url(#${gradientId})`} opacity={isDark ? 0.6 : 1}/>
        <rect x="8" y="16" width="32" height="16" rx="2" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.5" />
        
        {/* Keys */}
        <rect x="11" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="15" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="19" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="23" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="27" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="31" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="35" y="19" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />

        <rect x="12" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="16" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="20" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="24" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="28" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        <rect x="32" y="24" width="3" height="3" rx="0.5" fill="hsl(var(--muted))" />
        
        <rect x="16" y="29" width="16" height="2.5" rx="1" fill="hsl(var(--primary))" opacity="0.7" />
      </g>
    </svg>
  );
};

const TypetasticLogo = ({ iconOnly = false }: { iconOnly?: boolean }) => {
    return (
        <div className="flex items-center gap-3">
            <KeyboardKeyIcon />
            {!iconOnly && (
                 <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Typetastic
                </h1>
            )}
        </div>
    );
};

export default TypetasticLogo;
