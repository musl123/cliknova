import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Notificacao } from '../lib/supabase';


interface NotificationContextType {
  notificacoes: Notificacao[];
  adicionarNotificacao: (tipo: Notificacao['tipo'], titulo: string, mensagem: string) => void;
  marcarComoLida: (id: string) => void;
  limparNotificacoes: () => void;
  naoLidas: number;
  carregarNotificacoes: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const carregarNotificacoes = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('utilizador_id', user.id)
        .order('data_envio', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar notificações:', error);
        return;
      }

      if (data) {
        setNotificacoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, [user]);

  const adicionarNotificacao = useCallback(async (tipo: Notificacao['tipo'], titulo: string, mensagem: string) => {
    if (!user) {
      // Para utilizadores não autenticados, usar notificação local
      const novaNotificacao: Notificacao = {
        id: Date.now().toString(),
        utilizador_id: '',
        tipo,
        titulo,
        mensagem,
        lida: false,
        data_envio: new Date().toISOString()
      };
      
      setNotificacoes(prev => [novaNotificacao, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .insert({
          utilizador_id: user.id,
          tipo,
          titulo,
          mensagem
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar notificação:', error);
        return;
      }

      if (data) {
        setNotificacoes(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
    }
  }, [user]);
  const marcarComoLida = useCallback(async (id: string) => {
    if (!user) {
      // Para utilizadores não autenticados, atualizar localmente
      setNotificacoes(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id)
        .eq('utilizador_id', user.id);

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        return;
      }

      setNotificacoes(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, [user]);

  const limparNotificacoes = useCallback(async () => {
    if (!user) {
      setNotificacoes([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('utilizador_id', user.id);

      if (error) {
        console.error('Erro ao limpar notificações:', error);
        return;
      }

      setNotificacoes([]);
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  }, [user]);

  const naoLidas = notificacoes.filter(notif => !notif.lida).length;

  const value: NotificationContextType = {
    notificacoes,
    adicionarNotificacao,
    marcarComoLida,
    limparNotificacoes,
    naoLidas,
    carregarNotificacoes
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}