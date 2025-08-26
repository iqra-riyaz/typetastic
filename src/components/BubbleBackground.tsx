
"use client";

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseColor: string;
  letter: string;
}

const BUBBLE_COUNT = 25;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const lightColors = {
    bubbleColors: ['351, 100%, 78%', '240, 67%, 85%'], // Slightly darker pastels
    opacity: 0.8, // Increased opacity
    glowColor: 'rgba(255, 255, 255, 0.0)',
    letterColor: 'rgba(255, 255, 255, 0.9)',
    letterGlow: 'rgba(255, 255, 255, 0.0)'
};

const darkColors = {
    bubbleColors: ['197, 71%, 73%', '240, 60%, 80%'],
    opacity: 0.3,
    glowColor: 'rgba(230, 230, 250, 0.8)',
    letterColor: 'rgba(255, 255, 255, 0.7)',
    letterGlow: 'rgba(230, 230, 250, 0.9)'
};


export function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number>();
  const { theme } = useTheme();

  const colors = useMemo(() => theme === 'dark' ? darkColors : lightColors, [theme]);

  const createBubbles = useCallback((width: number, height: number) => {
    const { bubbleColors } = colors;
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      newBubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 20 + 30,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseColor: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        letter: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
      });
    }
    bubblesRef.current = newBubbles;
  }, [colors]);
  
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createBubbles(canvas.width, canvas.height);
    }
  }, [createBubbles]);
  
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { opacity, glowColor, letterColor, letterGlow } = colors;

    bubblesRef.current.forEach((bubble) => {
      const dx = bubble.x - mouseRef.current.x;
      const dy = bubble.y - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = 1 - distance / 150;
        bubble.vx += (dx / distance) * force * 0.5;
        bubble.vy += (dy / distance) * force * 0.5;
      }
      
      bubble.vx *= 0.98;
      bubble.vy *= 0.98;
      
      if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) bubble.vx *= -1;
      if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) bubble.vy *= -1;

      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${bubble.baseColor}, ${opacity})`;
      if (theme === 'dark') {
          ctx.shadowBlur = 25;
          ctx.shadowColor = glowColor;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.font = `${bubble.radius * 0.8}px "PT Sans"`;
      ctx.fillStyle = letterColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = letterGlow;
      ctx.shadowBlur = 15;
      ctx.fillText(bubble.letter, bubble.x, bubble.y);
      ctx.shadowBlur = 0;
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [colors, theme]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [resizeCanvas, animate]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
