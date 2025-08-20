import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos TypeScript para a base de dados
export interface Utilizador {
  id: string;
  nome: string;
  tipo_utilizador: 'admin' | 'produtor' | 'aluno' | 'afiliado';
  ativo: boolean;
  avatar_url?: string;
  telefone?: string;
  data_registo: string;
  ultima_atividade: string;
}

export interface Produto {
  id: string;
  produtor_id: string;
  titulo: string;
  descricao?: string;
  descricao_longa?: string;
  tipo_produto: 'curso' | 'ebook' | 'digital' | 'fisico';
  preco: number;
  preco_original?: number;
  moeda: string;
  ativo: boolean;
  destaque: boolean;
  imagem_url?: string;
  categoria?: string;
  tags?: string[];
  avaliacao_media: number;
  total_avaliacoes: number;
  total_vendas: number;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Curso {
  id: string;
  produto_id: string;
  titulo: string;
  descricao?: string;
  duracao_total: number;
  nivel: 'iniciante' | 'intermedio' | 'avancado';
  certificado: boolean;
  data_criacao: string;
}

export interface Modulo {
  id: string;
  curso_id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  data_criacao: string;
}

export interface Video {
  id: string;
  modulo_id: string;
  titulo: string;
  descricao?: string;
  url_video: string;
  duracao: number;
  ordem: number;
  preview: boolean;
  ativo: boolean;
  data_upload: string;
}

export interface Compra {
  id: string;
  utilizador_id: string;
  produto_id: string;
  preco_pago: number;
  desconto_aplicado: number;
  codigo_cupao?: string;
  moeda: string;
  metodo_pagamento?: string;
  status_pagamento: 'pendente' | 'pago' | 'cancelado' | 'reembolsado';
  data_compra: string;
  data_pagamento?: string;
}

export interface Notificacao {
  id: string;
  utilizador_id: string;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  titulo: string;
  mensagem: string;
  lida: boolean;
  url_acao?: string;
  data_envio: string;
}

export interface Afiliado {
  id: string;
  utilizador_id: string;
  codigo_referido: string;
  percentual_comissao: number;
  total_vendas: number;
  total_comissoes: number;
  ativo: boolean;
  data_registo: string;
}

export interface Levantamento {
  id: string;
  utilizador_id: string;
  tipo: 'vendas' | 'comissoes';
  valor: number;
  taxa: number;
  valor_liquido: number;
  moeda: string;
  metodo_pagamento?: string;
  status: 'pendente' | 'aprovado' | 'processando' | 'pago' | 'rejeitado';
  observacoes?: string;
  data_pedido: string;
  data_processamento?: string;
  data_pagamento?: string;
}