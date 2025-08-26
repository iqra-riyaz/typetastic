
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isToday, isYesterday } from 'date-fns';

export interface PerformanceEntry {
    wpm: number;
    accuracy: number;
    errors: number;
    score: number;
}

export interface Profile {
    username: string;
    performanceHistory: PerformanceEntry[];
    streak: number;
    lastPlayDate: string | null; // ISO string
    bestWpm: number;
    bestScore: number;
    avgAccuracy: number;
}

interface ProfileContextType {
  profiles: Record<string, Profile>;
  currentProfile: Profile | null;
  loading: boolean;
  setCurrentProfile: (username: string) => void;
  addProfile: (username: string) => Promise<boolean>;
  deleteProfile: (username: string) => void;
  updateCurrentProfileData: (data: { wpm: number; accuracy: number; errors: number; score: number }) => void;
  calculateScore: (wpm: number, accuracy: number, errors: number) => number;
}

const PROFILES_STORAGE_KEY = 'typetastic_profiles';
const CURRENT_PROFILE_KEY = 'typetastic_current_profile';

const ProfileContext = createContext<ProfileContextType>({
    profiles: {},
    currentProfile: null,
    loading: true,
    setCurrentProfile: () => {},
    addProfile: () => Promise.resolve(false),
    deleteProfile: () => {},
    updateCurrentProfileData: () => {},
    calculateScore: () => 0,
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const [profiles, setProfiles] = useState<Record<string, Profile>>({});
    const [currentProfile, _setCurrentProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        try {
            const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
            const storedCurrentProfileName = localStorage.getItem(CURRENT_PROFILE_KEY);

            let loadedProfiles: Record<string, Profile> = storedProfiles ? JSON.parse(storedProfiles) : {};
            setProfiles(loadedProfiles);
            
            if (storedCurrentProfileName && loadedProfiles[storedCurrentProfileName]) {
                _setCurrentProfile(loadedProfiles[storedCurrentProfileName]);
            } else if (Object.keys(loadedProfiles).length > 0) {
                const firstProfileName = Object.keys(loadedProfiles)[0];
                _setCurrentProfile(loadedProfiles[firstProfileName]);
                localStorage.setItem(CURRENT_PROFILE_KEY, firstProfileName);
            } else {
                 _setCurrentProfile(null);
                 localStorage.removeItem(CURRENT_PROFILE_KEY);
            }
        } catch (error) {
            console.error("Failed to load profiles from localStorage", error);
            setProfiles({});
            _setCurrentProfile(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveProfiles = (newProfiles: Record<string, Profile>) => {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles));
        setProfiles(newProfiles);
    };

    const setCurrentProfile = (username: string) => {
        if(profiles[username]) {
            _setCurrentProfile(profiles[username]);
            localStorage.setItem(CURRENT_PROFILE_KEY, username);
             toast({
                title: `Switched to ${username}`,
                description: `Now playing as ${username}.`,
                duration: 2000,
            });
        }
    };
    
    const addProfile = async (username: string): Promise<boolean> => {
        if (profiles[username]) {
             toast({ variant: "destructive", title: "Profile exists", description: "A profile with this name already exists."});
            return false;
        }
        const newProfile: Profile = {
            username,
            performanceHistory: [],
            streak: 0,
            lastPlayDate: null,
            bestWpm: 0,
            bestScore: 0,
            avgAccuracy: 0,
        };
        const newProfiles = { ...profiles, [username]: newProfile };
        saveProfiles(newProfiles);
        setCurrentProfile(username);
        toast({ title: `Welcome, ${username}!`, description: "Your profile has been created."});
        return true;
    };
    
    const deleteProfile = (username: string) => {
        const newProfiles = { ...profiles };
        delete newProfiles[username];
        
        saveProfiles(newProfiles);
        
        if (currentProfile?.username === username) {
             const remainingProfiles = Object.keys(newProfiles);
            if (remainingProfiles.length > 0) {
                setCurrentProfile(remainingProfiles[0]);
            } else {
                _setCurrentProfile(null);
                localStorage.removeItem(CURRENT_PROFILE_KEY);
            }
        }
        
        toast({ title: `Profile Deleted`, description: `The profile "${username}" has been removed.`});
    };
    
    const calculateScore = (wpm: number, accuracy: number, errors: number) => {
        if (wpm === 0 && accuracy === 0) return 0;
        return Math.max(0, Math.round((wpm * (accuracy / 100)) - (errors * 0.5)));
    }

    const updateCurrentProfileData = useCallback((data: { wpm: number; accuracy: number; errors: number; score: number }) => {
        if (!currentProfile) return;

        const updatedProfile = { ...profiles[currentProfile.username] };

        // Update histories
        const newPerformanceEntry: PerformanceEntry = {
            wpm: data.wpm,
            accuracy: data.accuracy,
            errors: data.errors,
            score: data.score,
        };
        updatedProfile.performanceHistory = [...(updatedProfile.performanceHistory || []), newPerformanceEntry];
        
        // Update best scores
        updatedProfile.bestWpm = Math.max(updatedProfile.bestWpm || 0, data.wpm);
        updatedProfile.bestScore = Math.max(updatedProfile.bestScore || 0, data.score);


        // Update streak
        const today = new Date();
        const lastPlay = updatedProfile.lastPlayDate ? new Date(updatedProfile.lastPlayDate) : null;
        
        if (!lastPlay || !isToday(lastPlay)) {
            if(lastPlay && isYesterday(lastPlay)) {
                updatedProfile.streak = (updatedProfile.streak || 0) + 1;
                 toast({ title: "Streak Extended!", description: `You're on a ${updatedProfile.streak} day streak! 🔥`, duration: 4000 });
            } else {
                 updatedProfile.streak = 1;
            }
        }
        updatedProfile.lastPlayDate = today.toISOString();
        
        const newProfiles = { ...profiles, [updatedProfile.username]: updatedProfile };
        saveProfiles(newProfiles);
        _setCurrentProfile(updatedProfile);
    }, [currentProfile, profiles, toast]);
    

    const value = { profiles, currentProfile, loading, setCurrentProfile, addProfile, deleteProfile, updateCurrentProfileData, calculateScore };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
