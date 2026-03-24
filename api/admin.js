const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Acesso nao autorizado' });
  }

  const { action } = req.body || req.query;

  try {
    if (action === 'listar') {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('criado_em', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ alunos: data });
    }

    if (action === 'cadastrar') {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) return res.status(400).json({ error: 'Nome, email e senha sao obrigatorios' });

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: senha,
        email_confirm: true
      });
      if (authError) return res.status(400).json({ error: authError.message });

      const { error: dbError } = await supabase.from('alunos').insert({
        user_id: authData.user.id,
        email: email,
        nome: nome,
        ativo: true
      });
      if (dbError) throw dbError;
      return res.status(200).json({ ok: true, mensagem: 'Aluno cadastrado com sucesso!' });
    }

    if (action === 'toggleAtivo') {
      const { id, ativo } = req.body;
      const { error } = await supabase.from('alunos').update({ ativo: ativo }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (action === 'alterarSenha') {
      const { user_id, nova_senha } = req.body;
      const { error } = await supabase.auth.admin.updateUserById(user_id, { password: nova_senha });
      if (error) throw error;
      return res.status(200).json({ ok: true, mensagem: 'Senha alterada!' });
    }

    if (action === 'excluir') {
      const { id, user_id } = req.body;
      await supabase.from('alunos').delete().eq('id', id);
      await supabase.auth.admin.deleteUser(user_id);
      return res.status(200).json({ ok: true, mensagem: 'Aluno excluido!' });
    }

    return res.status(400).json({ error: 'Acao desconhecida' });

  } catch (err) {
    console.error('Erro admin:', err);
    return res.status(500).json({ error: err.message });
  }
};
