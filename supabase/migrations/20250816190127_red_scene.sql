/*
  # Esquema Completo da Base de Dados ClikeNOVA

  1. Tabelas Principais
    - `utilizadores` - Todos os tipos de utilizadores (admin, produtor, aluno, afiliado)
    - `produtos` - Cursos, e-books, produtos digitais e físicos
    - `cursos` - Informações específicas dos cursos
    - `modulos` - Módulos organizacionais dos cursos
    - `videos` - Vídeo-aulas dos módulos
    - `ebooks` - E-books em PDF
    - `materiais` - Materiais extra em PDF
    - `assinaturas` - Planos mensais e anuais
    - `compras` - Compras avulsas
    - `afiliados` - Sistema de afiliados
    - `vendas_afiliados` - Vendas através de afiliados
    - `levantamentos` - Sistema de saques em euros
    - `notificacoes` - Notificações internas

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para cada tipo de utilizador
    - Controlo de acesso baseado em funções
*/

-- Utilizadores (Admin, Produtores, Alunos, Afiliados)
CREATE TABLE IF NOT EXISTS utilizadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  palavra_passe text NOT NULL,
  tipo_utilizador text CHECK (tipo_utilizador IN ('admin','produtor','aluno','afiliado')) NOT NULL,
  ativo boolean DEFAULT true,
  avatar_url text,
  telefone text,
  data_registo timestamptz DEFAULT now(),
  ultima_atividade timestamptz DEFAULT now()
);

-- Produtos (cursos, e-books, físicos, digitais)
CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produtor_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  descricao_longa text,
  tipo_produto text CHECK (tipo_produto IN ('curso','ebook','digital','fisico')) NOT NULL,
  preco numeric(10,2) NOT NULL DEFAULT 0,
  preco_original numeric(10,2),
  moeda text DEFAULT 'EUR',
  ativo boolean DEFAULT true,
  destaque boolean DEFAULT false,
  imagem_url text,
  categoria text,
  tags text[],
  avaliacao_media numeric(3,2) DEFAULT 0,
  total_avaliacoes integer DEFAULT 0,
  total_vendas integer DEFAULT 0,
  data_criacao timestamptz DEFAULT now(),
  data_atualizacao timestamptz DEFAULT now()
);

-- Cursos (ligados a produtos)
CREATE TABLE IF NOT EXISTS cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  duracao_total integer DEFAULT 0, -- em minutos
  nivel text CHECK (nivel IN ('iniciante','intermedio','avancado')) DEFAULT 'iniciante',
  certificado boolean DEFAULT false,
  data_criacao timestamptz DEFAULT now()
);

-- Módulos do curso
CREATE TABLE IF NOT EXISTS modulos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id uuid REFERENCES cursos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  ordem integer NOT NULL,
  ativo boolean DEFAULT true,
  data_criacao timestamptz DEFAULT now()
);

-- Vídeos dos módulos
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id uuid REFERENCES modulos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  url_video text NOT NULL,
  duracao integer DEFAULT 0, -- em segundos
  ordem integer NOT NULL,
  preview boolean DEFAULT false,
  ativo boolean DEFAULT true,
  data_upload timestamptz DEFAULT now()
);

-- E-books
CREATE TABLE IF NOT EXISTS ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  autor text,
  url_pdf text NOT NULL,
  url_capa text,
  numero_paginas integer DEFAULT 0,
  tamanho_arquivo numeric(10,2), -- em MB
  data_upload timestamptz DEFAULT now()
);

-- Materiais extra em PDF
CREATE TABLE IF NOT EXISTS materiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id uuid REFERENCES cursos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  url_pdf text NOT NULL,
  tamanho_arquivo numeric(10,2), -- em MB
  data_upload timestamptz DEFAULT now()
);

-- Assinaturas (mensal / anual)
CREATE TABLE IF NOT EXISTS assinaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  plano text CHECK (plano IN ('mensal','anual')) NOT NULL,
  preco_pago numeric(10,2) NOT NULL,
  moeda text DEFAULT 'EUR',
  ativo boolean DEFAULT true,
  cancelado boolean DEFAULT false,
  data_inicio timestamptz DEFAULT now(),
  data_fim timestamptz,
  data_cancelamento timestamptz,
  proximo_pagamento timestamptz
);

-- Compras avulso (sem assinatura)
CREATE TABLE IF NOT EXISTS compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  preco_pago numeric(10,2) NOT NULL,
  desconto_aplicado numeric(10,2) DEFAULT 0,
  codigo_cupao text,
  moeda text DEFAULT 'EUR',
  metodo_pagamento text,
  status_pagamento text CHECK (status_pagamento IN ('pendente','pago','cancelado','reembolsado')) DEFAULT 'pendente',
  data_compra timestamptz DEFAULT now(),
  data_pagamento timestamptz
);

-- Cupões de desconto
CREATE TABLE IF NOT EXISTS cupoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  descricao text,
  tipo_desconto text CHECK (tipo_desconto IN ('percentual','fixo')) NOT NULL,
  valor_desconto numeric(10,2) NOT NULL,
  valor_minimo numeric(10,2) DEFAULT 0,
  limite_uso integer,
  usos_atuais integer DEFAULT 0,
  ativo boolean DEFAULT true,
  data_inicio timestamptz DEFAULT now(),
  data_fim timestamptz,
  data_criacao timestamptz DEFAULT now()
);

-- Afiliados
CREATE TABLE IF NOT EXISTS afiliados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  codigo_referido text UNIQUE NOT NULL,
  percentual_comissao numeric(5,2) DEFAULT 10.00,
  total_vendas integer DEFAULT 0,
  total_comissoes numeric(10,2) DEFAULT 0,
  ativo boolean DEFAULT true,
  data_registo timestamptz DEFAULT now()
);

-- Vendas por Afiliados
CREATE TABLE IF NOT EXISTS vendas_afiliados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  afiliado_id uuid REFERENCES afiliados(id) ON DELETE CASCADE,
  compra_id uuid REFERENCES compras(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  valor_venda numeric(10,2) NOT NULL,
  valor_comissao numeric(10,2) NOT NULL,
  percentual_comissao numeric(5,2) NOT NULL,
  status text CHECK (status IN ('pendente','aprovada','paga')) DEFAULT 'pendente',
  data_venda timestamptz DEFAULT now(),
  data_pagamento timestamptz
);

-- Saques / Levantamentos
CREATE TABLE IF NOT EXISTS levantamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  tipo text CHECK (tipo IN ('vendas','comissoes')) NOT NULL,
  valor numeric(10,2) NOT NULL,
  taxa numeric(10,2) DEFAULT 0,
  valor_liquido numeric(10,2) NOT NULL,
  moeda text DEFAULT 'EUR',
  metodo_pagamento text,
  dados_pagamento jsonb,
  status text CHECK (status IN ('pendente','aprovado','processando','pago','rejeitado')) DEFAULT 'pendente',
  observacoes text,
  data_pedido timestamptz DEFAULT now(),
  data_processamento timestamptz,
  data_pagamento timestamptz
);

-- Avaliações de produtos
CREATE TABLE IF NOT EXISTS avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  nota integer CHECK (nota >= 1 AND nota <= 5) NOT NULL,
  comentario text,
  ativo boolean DEFAULT true,
  data_criacao timestamptz DEFAULT now(),
  UNIQUE(produto_id, utilizador_id)
);

-- Progresso dos alunos nos cursos
CREATE TABLE IF NOT EXISTS progresso_cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  curso_id uuid REFERENCES cursos(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  concluido boolean DEFAULT false,
  tempo_assistido integer DEFAULT 0, -- em segundos
  data_inicio timestamptz DEFAULT now(),
  data_conclusao timestamptz,
  UNIQUE(utilizador_id, video_id)
);

-- Notificações internas
CREATE TABLE IF NOT EXISTS notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES utilizadores(id) ON DELETE CASCADE,
  tipo text CHECK (tipo IN ('sucesso','erro','aviso','info')) NOT NULL,
  titulo text NOT NULL,
  mensagem text NOT NULL,
  lida boolean DEFAULT false,
  url_acao text,
  data_envio timestamptz DEFAULT now()
);

-- Configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor text NOT NULL,
  descricao text,
  tipo text CHECK (tipo IN ('texto','numero','boolean','json')) DEFAULT 'texto',
  data_atualizacao timestamptz DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao, tipo) VALUES
('taxa_levantamento', '2.5', 'Taxa percentual para levantamentos', 'numero'),
('valor_minimo_levantamento', '50', 'Valor mínimo para levantamento em euros', 'numero'),
('comissao_padrao_afiliado', '10', 'Comissão padrão para afiliados em percentual', 'numero'),
('moeda_padrao', 'EUR', 'Moeda padrão da plataforma', 'texto'),
('email_suporte', 'suporte@clikenova.com', 'Email de suporte da plataforma', 'texto')
ON CONFLICT (chave) DO NOTHING;

-- Habilitar RLS em todas as tabelas
ALTER TABLE utilizadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE afiliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas_afiliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE levantamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para utilizadores
CREATE POLICY "Utilizadores podem ver o próprio perfil"
  ON utilizadores FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Utilizadores podem atualizar o próprio perfil"
  ON utilizadores FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Políticas RLS para produtos
CREATE POLICY "Produtos ativos são visíveis para todos"
  ON produtos FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Produtores podem gerir os próprios produtos"
  ON produtos FOR ALL
  TO authenticated
  USING (auth.uid()::text = produtor_id::text);

-- Políticas RLS para cursos
CREATE POLICY "Cursos são visíveis para utilizadores autenticados"
  ON cursos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Produtores podem gerir os próprios cursos"
  ON cursos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM produtos 
      WHERE produtos.id = cursos.produto_id 
      AND produtos.produtor_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para módulos
CREATE POLICY "Módulos são visíveis para utilizadores autenticados"
  ON modulos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Produtores podem gerir módulos dos próprios cursos"
  ON modulos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cursos 
      JOIN produtos ON produtos.id = cursos.produto_id
      WHERE cursos.id = modulos.curso_id 
      AND produtos.produtor_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para vídeos
CREATE POLICY "Vídeos são visíveis para utilizadores autenticados"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Produtores podem gerir vídeos dos próprios cursos"
  ON videos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM modulos 
      JOIN cursos ON cursos.id = modulos.curso_id
      JOIN produtos ON produtos.id = cursos.produto_id
      WHERE modulos.id = videos.modulo_id 
      AND produtos.produtor_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para compras
CREATE POLICY "Utilizadores podem ver as próprias compras"
  ON compras FOR SELECT
  TO authenticated
  USING (auth.uid()::text = utilizador_id::text);

CREATE POLICY "Utilizadores podem criar compras"
  ON compras FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = utilizador_id::text);

-- Políticas RLS para notificações
CREATE POLICY "Utilizadores podem ver as próprias notificações"
  ON notificacoes FOR SELECT
  TO authenticated
  USING (auth.uid()::text = utilizador_id::text);

CREATE POLICY "Utilizadores podem atualizar as próprias notificações"
  ON notificacoes FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = utilizador_id::text);

-- Políticas RLS para progresso dos cursos
CREATE POLICY "Utilizadores podem ver o próprio progresso"
  ON progresso_cursos FOR SELECT
  TO authenticated
  USING (auth.uid()::text = utilizador_id::text);

CREATE POLICY "Utilizadores podem atualizar o próprio progresso"
  ON progresso_cursos FOR ALL
  TO authenticated
  USING (auth.uid()::text = utilizador_id::text);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_produtos_produtor ON produtos(produtor_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_tipo ON produtos(tipo_produto);
CREATE INDEX IF NOT EXISTS idx_cursos_produto ON cursos(produto_id);
CREATE INDEX IF NOT EXISTS idx_modulos_curso ON modulos(curso_id);
CREATE INDEX IF NOT EXISTS idx_videos_modulo ON videos(modulo_id);
CREATE INDEX IF NOT EXISTS idx_compras_utilizador ON compras(utilizador_id);
CREATE INDEX IF NOT EXISTS idx_compras_produto ON compras(produto_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_utilizador ON notificacoes(utilizador_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_progresso_utilizador ON progresso_cursos(utilizador_id);
CREATE INDEX IF NOT EXISTS idx_progresso_curso ON progresso_cursos(curso_id);

-- Funções auxiliares
CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar data_atualizacao
CREATE TRIGGER trigger_produtos_data_atualizacao
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_data_atualizacao();

-- Função para calcular média de avaliações
CREATE OR REPLACE FUNCTION atualizar_avaliacao_produto()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE produtos SET
    avaliacao_media = (
      SELECT COALESCE(AVG(nota), 0)
      FROM avaliacoes
      WHERE produto_id = COALESCE(NEW.produto_id, OLD.produto_id)
      AND ativo = true
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM avaliacoes
      WHERE produto_id = COALESCE(NEW.produto_id, OLD.produto_id)
      AND ativo = true
    )
  WHERE id = COALESCE(NEW.produto_id, OLD.produto_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar avaliações
CREATE TRIGGER trigger_avaliacoes_atualizar_produto
  AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_avaliacao_produto();