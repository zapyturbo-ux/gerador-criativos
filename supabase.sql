-- Cole este codigo no SQL Editor do Supabase e clique RUN

CREATE TABLE IF NOT EXISTS alunos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acesso TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS criativos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  briefing JSONB,
  total_cenas INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE criativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aluno_ver_proprio" ON alunos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "aluno_ver_criativos" ON criativos FOR SELECT USING (aluno_id IN (SELECT id FROM alunos WHERE user_id = auth.uid()));
CREATE POLICY "backend_tudo_alunos" ON alunos FOR ALL USING (true);
CREATE POLICY "backend_tudo_criativos" ON criativos FOR ALL USING (true);
