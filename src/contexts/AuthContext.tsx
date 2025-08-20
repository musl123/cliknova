import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Utilizador } from '../lib/supabase';


interface AuthContextType {
  user: Utilizador | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nome: string, email: string, password: string, tipo: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Utilizador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão do Supabase
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Buscar dados completos do utilizador
          const { data: userData } = await supabase
            .from('utilizadores')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from('utilizadores')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (userData) {
            setUser(userData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        return false;
      }

      if (data.user) {
        // Buscar dados completos do utilizador
        const { data: userData } = await supabase
          .from('utilizadores')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (userData) {
          setUser(userData);
          return true;
        } else {
          // Utilizador autenticado mas sem registo na tabela utilizadores
          console.error('Utilizador autenticado mas sem perfil na base de dados');
          await supabase.auth.signOut();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (nome: string, email: string, password: string, tipo: string): Promise<boolean> => {
    try {
      // Criar conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('Erro no registo:', error);
        return false;
      }

      if (data.user) {
        // Criar registo na tabela utilizadores
        const { data: userData, error: insertError } = await supabase
          .from('utilizadores')
          .insert({
            id: data.user.id,
            nome,
            email,
            tipo_utilizador: tipo as Utilizador['tipo_utilizador']
          })
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Erro ao criar utilizador:', insertError);
          // Limpar a conta de autenticação se falhou a criação do perfil
          await supabase.auth.signOut();
          return false;
        }

        if (userData) {
          setUser(userData);
          return true;
        } else {
          console.error('Falha ao criar perfil do utilizador');
          await supabase.auth.signOut();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro no registo:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}