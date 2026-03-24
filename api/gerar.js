const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function buildPrompt(d, scene, total, ancora) {
  var PA  = d.nome + ', ' + d.idade + ' years old, ' + d.pele + ', ' + d.cabcor + ' ' + d.cabestilo + ', wearing a ' + d.rcorEn + ' ' + d.roupa + ', ' + d.acess + ', ' + d.calc;
  var FA  = d.familiar + ' with ' + d.fpele + ' skin wearing ' + d.frcorEn + ' clothing';
  var SHA = d.pjgen + ' with ' + d.pjpele + ', ' + d.pjcab + ', ' + d.pjacess + ', wearing ' + d.pjrcorEn + ' garment';
  var isCCTV   = d.gancho.indexOf('SECURITY_CAM') >= 0;
  var isAttack = d.gancho.indexOf('SECURITY_CAM_ATTACK') >= 0;

  var inst = '';
  if (scene.tipo === 'HOOK') {
    inst = 'SCENE 1 THE HOOK. Must stop the scroll. Visceral, devastating. Hook: ' + d.gancho;
    if (isAttack) inst += ' Attack: ' + d.cctvtipo;
    inst += ' Pain: ' + d.dor + '. Limitation: ' + d.nome + ' ' + d.lim + '.';
    if (isCCTV) {
      inst += ' CCTV VISUAL: grainy desaturated, high corner-mount, timestamp, fisheye distortion.';
      inst += ' AUDIO: NO DIALOGUE. Only raw ambient tension. At most one short sound: "Ai!".';
      inst += ' VEO3 POLICY: use tense standoff, blocking, surrounding, firm grip, resistance. NEVER: brutal, violent, slam, tackle, assault, punch, kick, rip.';
    }
  } else if (scene.tipo === 'FAMILY') {
    inst = 'FAMILY SUPPORT. Family member: ' + FA + '. Talking to healer via VIDEO CALL on phone, OR speaking to another family member, OR quietly looking at a photo of protagonist. NOT to camera. Desperate, emotional, voice breaking. Warm golden sertao sunlight.';
  } else if (scene.tipo === 'HEALER') {
    inst = 'HEALER WISDOM. Healer: ' + SHA + '. Setting: ' + d.pjcen + '. Tone: ' + d.pjtom + '. Speaking via video call responding to family, OR preparing herbs looking at roots, OR walking through forest speaking to the wind. NOT looking at camera. Bright dappled sunlight through canopy.';
  } else if (scene.tipo === 'CONFLICT') {
    inst = 'CONFLICT. Villain: ' + d.ant + '. Speaking FURIOUSLY ON PHONE to associate, OR giving orders in closed meeting, OR typing aggressively. NOT to camera. ONLY cold sterile blue-white fluorescent light, zero natural light.';
  } else if (scene.tipo === 'FAITH') {
    inst = 'FAITH ACTION. ' + d.nome + ' ALONE at kitchen table, kneeling in prayer by bed, or at window. Holds product (' + d.prod + ') in both hands, praying quietly to herself. NOT to camera. Private intimate moment of faith. Tone: ' + d.tom + '. Warm golden sunlight.';
  } else if (scene.tipo === 'TRANSFORMATION') {
    inst = 'TRANSFORMATION. ' + d.nome + ' healed, doing: ' + d.lim.replace('can no longer', 'can now again') + '. Family (' + FA + ') PRESENT watching with joy, filming on phone, or running to hug. They interact WITH EACH OTHER. Most joyful vibrant scene. Maximum warmth and color.';
  } else {
    inst = 'SOCIAL PROOF. ' + d.nome + ' in community talking TO A NEIGHBOR naturally. Church, market, street. They talk TO EACH OTHER. Bright sunny daylight.';
  }

  var L = [];
  L.push('You are a world-class cinematographer and Veo3 prompt engineer creating a cinematic short film for Brazilian health marketing.');
  L.push('');
  L.push('=== VISUAL ANCHORS - IDENTICAL IN ALL SCENES ===');
  L.push('PROTAGONIST: ' + PA);
  L.push('Voice: ' + d.voz + ', ' + d.sotaque);
  L.push('FAMILY MEMBER: ' + FA);
  L.push('HEALER: ' + SHA);
  L.push('Healer voice: ALWAYS deep slow grave indigenous Brazilian ancestral accent - NEVER changes');
  L.push('VISUAL ANCHOR: ' + ancora);
  L.push('');
  L.push('=== NARRATIVE ARC ===');
  L.push('These ' + total + ' scenes form ONE continuous cinematic story:');
  L.push('S1 Hook: The problem or threat');
  L.push('S2 Family: Loved one desperately seeks help via phone call to healer');
  L.push('S3 Healer: Healer receives call and responds with ancestral wisdom');
  if (d.antativo === 'sim') {
    L.push('S4 Conflict: Villains panic trying to suppress the natural remedy');
    L.push('S5 Faith: Protagonist takes remedy with hope');
    L.push('S6 Transformation: Protagonist healed - family witnesses the miracle');
  } else {
    L.push('S4 Faith: Protagonist takes remedy with hope and prayer');
    L.push('S5 Transformation: Protagonist healed - family witnesses the miracle');
    if (total >= 6) L.push('S6 Social Proof: Protagonist shares healing with community');
  }
  L.push('CURRENT SCENE: ' + scene.num + ' of ' + total + ': ' + scene.label.toUpperCase());
  L.push('');
  L.push('=== THIS SCENE ===');
  L.push(inst);
  L.push('');
  L.push('Duration: ' + d.duracao);
  if (d.extra) L.push('Extra: ' + d.extra);
  L.push('');
  L.push('=== CRITICAL RULES ===');
  L.push('0. VEO3 POLICY: NEVER use: brutal, violent, slam, tackle, assault, punch, kick, rip. USE: tense standoff, blocking, surrounding, firm grip, resistance, confrontation.');
  L.push('1. CINEMA STYLE: Cinematic short film - not testimonial or infomercial.');
  L.push('2. NO FOURTH WALL: Characters NEVER look at camera except SHAMAN_WARNING and FAMILY_DESPERATE hooks.');
  L.push('3. NATURAL: Characters speak TO EACH OTHER - phone, family present, prayer, thinking aloud.');
  L.push('4. CONNECTED STORY: Each scene follows naturally from previous, leads to next.');
  L.push('5. ALL scenes BRIGHT SUNNY DAYLIGHT except conflict (cold fluorescent only).');
  L.push('6. Sertao: warm golden sunlight, red dry earth, whitewashed adobe walls.');
  L.push('7. Forest: bright dappled sunlight through canopy, vivid greens.');
  L.push('8. 4K ultra-realistic, visible skin pores, no CGI.');
  L.push('9. Raw Brazilian Portuguese audio only. NO subtitles. NO transition effects.');
  L.push('');
  L.push('=== OUTPUT - PURE JSON ONLY ===');
  L.push('Return ONLY a pure valid JSON object. No markdown. No code fences. No extra text.');
  L.push('{');
  L.push('  "numero": ' + scene.num + ',');
  L.push('  "nome": "nome cinematografico desta cena em portugues",');
  L.push('  "tipo": "' + scene.tipo + '",');
  L.push('  "tipo_gancho": "tipo do gancho se cena 1",');
  L.push('  "duracao": "' + d.duracao + '",');
  L.push('  "personagem": "personagem principal",');
  L.push('  "para_quem_fala": "para quem o personagem fala nesta cena",');
  L.push('  "copy_ptbr": "fala em portugues - para outra pessoa ou para si mesmo, nunca para a camera. Minimo 4 frases, 8-12 segundos.",');
  L.push('  "cenario_detalhado": "cenario em portugues: local, props, luz, cores, texturas",');
  L.push('  "acao_detalhada": "acao quadro a quadro: movimentos, expressoes faciais, interacoes",');
  L.push('  "camera_detalhada": "camera: angulo, movimento, lente mm, profundidade de campo",');
  L.push('  "som_detalhado": "som: ambiente especifico, respiracao, objetos, silencio dramatico",');
  L.push('  "prompt_veo3": "ULTRA-DETAILED VEO3 PROMPT IN ENGLISH minimum 15 sentences: (1) Cinematic ultra-realistic 4K short film ' + d.duracao + '. (2) PROTAGONIST: ' + PA.substring(0, 100) + ' identical appearance every scene. (3) Exact location all props named. (4) Precise lighting color temp direction shadows. (5) Frame by frame physical action body language facial expressions. (6) WHO THEY TALK TO: exactly who character addresses and how - phone call, family present, praying, thinking - NEVER facing camera except specified hooks. (7) Camera starting position movement lens mm depth of field. (8) Character speaks in Brazilian Portuguese with ' + d.sotaque + ' voice ' + d.voz + ': [EXACT copy_ptbr TEXT]. (9) Healer voice if present: deep grave slow indigenous Brazilian ancestral accent. (10) All ambient sounds named. (11) Emotional atmosphere. (12) Color palette and mood. (13) Ultra-realistic skin pores visible, cinematic color grading, 4K, raw Portuguese audio only, no subtitles."');
  L.push('}');
  return L.join('\n');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token nao fornecido' });
    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Token invalido' });

    const { data: aluno } = await supabase.from('alunos').select('id, ativo').eq('email', user.email).single();
    if (!aluno) return res.status(403).json({ error: 'Aluno nao encontrado' });
    if (!aluno.ativo) return res.status(403).json({ error: 'Acesso bloqueado. Entre em contato com o administrador.' });

    const { briefing, scene, total, ancora } = req.body;
    if (!briefing || !scene) return res.status(400).json({ error: 'Dados incompletos' });

    const prompt = buildPrompt(briefing, scene, total, ancora);

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: 'You are a world-class Veo3 prompt engineer. Always respond with a single pure valid JSON object only. No markdown. No code fences. No text before or after.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      return res.status(500).json({ error: 'Erro na API do Claude: ' + errText });
    }

    const claudeData = await claudeRes.json();
    const raw = (claudeData.content || []).map(function(c) { return c.text || ''; }).join('');
    if (!raw.trim()) return res.status(500).json({ error: 'Resposta vazia do Claude' });

    var clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    var fb = clean.indexOf('{');
    var lb = clean.lastIndexOf('}');
    if (fb < 0 || lb < 0) return res.status(500).json({ error: 'JSON nao encontrado' });
    var cena = JSON.parse(clean.substring(fb, lb + 1));

    if (scene.num === total) {
      await supabase.from('criativos').insert({ aluno_id: aluno.id, briefing: briefing, total_cenas: total });
      await supabase.from('alunos').update({ ultimo_acesso: new Date().toISOString() }).eq('id', aluno.id);
    }

    return res.status(200).json(cena);

  } catch (err) {
    console.error('Erro gerar:', err);
    return res.status(500).json({ error: err.message });
  }
};
