import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { auth, db } from '@/lib/firebase';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function firebaseUserToAuthUser(firebaseUser: User, displayName?: string): AuthUser {
  return {
    id: firebaseUser.uid,
    name: displayName ?? firebaseUser.displayName ?? 'Usuário',
    email: firebaseUser.email ?? '',
  };
}

function mapLoginError(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/invalid-login-credentials' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      return 'Email ou senha incorretos.';
    }

    if (error.code === 'auth/too-many-requests') {
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    }
  }

  return 'Erro ao realizar login.';
}

function mapRegisterError(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/email-already-in-use') {
      return 'Este email já está em uso.';
    }

    if (error.code === 'auth/invalid-email') {
      return 'Email inválido.';
    }

    if (error.code === 'auth/weak-password') {
      return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
    }

    if (error.code === 'auth/too-many-requests') {
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    }
  }

  return 'Erro ao criar conta.';
}

function mapResetPasswordError(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/user-not-found') {
      return 'Não encontramos uma conta com este email.';
    }

    if (error.code === 'auth/invalid-email') {
      return 'Email inválido.';
    }

    if (error.code === 'auth/too-many-requests') {
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    }
  }

  return 'Erro ao enviar email de redefinição.';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const data = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            name: data?.name ?? firebaseUser.displayName ?? 'Usuário',
            email: firebaseUser.email ?? '',
          });
        } catch {
          setUser(firebaseUserToAuthUser(firebaseUser));
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          throw new Error(mapLoginError(error));
        }
      },
      register: async (name, email, password) => {
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName: name });

          await setDoc(doc(db, 'users', credential.user.uid), {
            name,
            email,
            createdAt: serverTimestamp(),
          });

          setUser({
            id: credential.user.uid,
            name,
            email,
          });
        } catch (error) {
          throw new Error(mapRegisterError(error));
        }
      },
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (error) {
          throw new Error(mapResetPasswordError(error));
        }
      },
      logout: async () => {
        await signOut(auth);
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
