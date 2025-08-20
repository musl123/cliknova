/*
  # Corrigir políticas RLS para utilizadores

  1. Políticas RLS
    - Permitir que utilizadores autenticados criem o próprio perfil
    - Permitir que utilizadores autenticados vejam o próprio perfil
    - Permitir que utilizadores autenticados atualizem o próprio perfil

  2. Segurança
    - Manter RLS ativo na tabela utilizadores
    - Garantir que cada utilizador só pode aceder aos próprios dados
*/

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Utilizadores podem ver o próprio perfil" ON utilizadores;
DROP POLICY IF EXISTS "Utilizadores podem atualizar o próprio perfil" ON utilizadores;

-- Criar política para permitir inserção do próprio perfil
CREATE POLICY "Utilizadores podem criar o próprio perfil"
  ON utilizadores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Criar política para permitir visualização do próprio perfil
CREATE POLICY "Utilizadores podem ver o próprio perfil"
  ON utilizadores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Criar política para permitir atualização do próprio perfil
CREATE POLICY "Utilizadores podem atualizar o próprio perfil"
  ON utilizadores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Garantir que RLS está ativo
ALTER TABLE utilizadores ENABLE ROW LEVEL SECURITY;