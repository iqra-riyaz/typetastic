"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from './ProfileContext';

export type Settings = {
  difficulty: 'easy' | 'medium' | 'hard';
  textSource: 'random' | 'quotes' | 'pangram' | 'custom';
  customText: string;
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const defaultSettings: Settings = {
  difficulty: 'easy',
  textSource: 'quotes',
  customText: 'The quick brown fox jumps over the lazy dog.',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateSetting: () => {},
});

const SETTINGS_STORAGE_KEY = 'typetastic_settings';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentProfile } = useProfile();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  
  const getStorageKey = useCallback(() => {
    if (!currentProfile) return null;
    return `${SETTINGS_STORAGE_KEY}_${currentProfile.username}`;
  }, [currentProfile]);


  useEffect(() => {
    setLoading(true);
    const storageKey = getStorageKey();
    if (storageKey) {
      const storedSettings = localStorage.getItem(storageKey);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(defaultSettings);
      }
    } else {
       setSettings(defaultSettings);
    }
    setLoading(false);
  }, [currentProfile, getStorageKey]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    }
    
    // Only toast on dropdown changes, not every keystroke in textarea
    if (key !== 'customText') {
      toast({
          title: '✅ Setting Saved!',
          description: `Your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
          duration: 2000,
      });
    }
  };

  const value = { settings, loading, updateSetting };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
