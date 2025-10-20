import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await userService.getUser(firebaseUser.uid);
        if (userDoc.success) {
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userDoc.data.name || firebaseUser.email.split('@')[0],
            role: userDoc.data.role || 'user',
            ...userDoc.data
          };
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        } else {
          // Create user document if it doesn't exist
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: firebaseUser.email === 'admin@alh.com' ? 'admin' : 'user',
          };
          await userService.createUser(firebaseUser.uid, userData);
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by the auth state listener
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update Firebase Auth profile
      await updateFirebaseProfile(user, { displayName: name });

      // Create user document in Firestore
      const userData = {
        email,
        name,
        role: email === 'admin@alh.com' ? 'admin' : 'user',
      };
      await userService.createUser(user.uid, userData);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (user) {
        // Update Firestore user document
        await userService.updateUser(user.id, updates);

        // Update local state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        setIsAdmin(updatedUser.role === 'admin');

        // Update Firebase Auth profile if name changed
        if (updates.name && auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, { displayName: updates.name });
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
