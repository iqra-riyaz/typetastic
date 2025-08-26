"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, DocumentData } from 'firebase/firestore';

interface User extends FirebaseUser {
  // Add any custom user properties here if you extend the user document
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData?: DocumentData | null; // To store additional user data from Firestore
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setUser(firebaseUser as User | null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
        } else {
          setUserData(null);
        }
      });
      return () => unsub();
    } else {
      setUserData(null);
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, loading, userData }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-background">
          {/* You can add a lightweight spinner here if you want */}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
