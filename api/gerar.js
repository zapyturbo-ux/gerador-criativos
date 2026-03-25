function buildPrompt(d, scene, total, ancora) {
  var PA  = d.nome + ', ' + d.idade + ' years old, ' + d.pele + ', ' + d.cabcor + ' ' + d.cabestilo + ', wearing a ' + d.rcorEn + ' ' + d.roupa + ', ' + d.acess + ', ' + d.calc;
  var FA  = d.familiar + ' with ' + d.fpele + ' skin wearing ' + d.frcorEn + ' clothing';
  var SHA = d.pjgen + ' with ' + d.pjpele + ', ' + d.pjcab + ', ' + d.pjacess + ', wearing ' + d.pjrcorEn + ' garment';

  var inst = '';

  if (scene.tipo === 'HOOK') {
    inst = 'HOOK SCENE. Immediate tension. No explanation. Show the problem instantly. Pain: ' + d.dor + '. Limitation: ' + d.nome + ' ' + d.lim + '.';
  } else if (scene.tipo === 'FAMILY') {
    inst = 'FAMILY SUPPORT. Emotional urgency. Family member interacting naturally (phone call, conversation, or silence with emotional weight).';
  } else if (scene.tipo === 'HEALER') {
    inst = 'HEALER. Calm authority. Ancestral presence. Speaking to someone, never to camera.';
  } else if (scene.tipo === 'CONFLICT') {
    inst = 'CONFLICT. Controlled aggression. Cold environment. No sunlight. Tension through behavior, not violence.';
  } else if (scene.tipo === 'FAITH') {
    inst = 'FAITH. Intimate, silent, personal moment. Slow movement, internal emotion.';
  } else if (scene.tipo === 'TRANSFORMATION') {
    inst = 'TRANSFORMATION. Active joy. Movement. Family reacting in the scene.';
  } else {
    inst = 'SOCIAL PROOF. Natural conversation between people in a real environment.';
  }

  var L = [];

  L.push('You are a world-class cinematic director and Veo3 prompt engineer.');
  L.push('Your job is to create a highly realistic cinematic scene for a short film.');
  L.push('');

  L.push('=== VISUAL ANCHOR (MUST NEVER CHANGE) ===');
  L.push('PROTAGONIST: ' + PA);
  L.push('FAMILY: ' + FA);
  L.push('HEALER: ' + SHA);
  L.push('VISUAL ANCHOR: ' + ancora);
  L.push('The protagonist MUST maintain identical face, skin, hair, clothing, and accessories in ALL scenes.');
  L.push('');

  L.push('=== STORY CONTEXT ===');
  L.push('This is scene ' + scene.num + ' of ' + total + ' in a continuous story.');
  L.push(inst);
  L.push('');

  L.push('=== QUALITY RULES ===');
  L.push('Be extremely concrete and physical.');
  L.push('Do NOT use generic phrases like cinematic, emotional, dramatic, realistic, beautiful lighting.');
  L.push('Everything must be visually and physically described.');
  L.push('Focus on body language, breathing, eye direction, hand movement, and interaction with environment.');
  L.push('');

  L.push('=== OUTPUT RULES ===');
  L.push('Return ONLY valid JSON.');
  L.push('No markdown. No explanation.');
  L.push('');

  L.push('{');

  L.push('"numero": ' + scene.num + ',');
  L.push('"nome": "nome curto da cena",');
  L.push('"tipo": "' + scene.tipo + '",');

  L.push('"copy_ptbr": "fala natural em portugues brasileiro, como pessoa real falando, com pausas e emoção, nunca formal e nunca explicando",');

  L.push('"cenario_detalhado": "descricao completa do ambiente: local, objetos, luz, cores, textura, clima",');

  L.push('"acao_detalhada": "descricao fisica detalhada: movimentos do corpo, mãos, olhos, respiração, interação com objetos",');

  L.push('"camera_detalhada": "tipo de enquadramento, angulo, movimento da camera, lente mm, profundidade de campo, foco",');

  L.push('"som_detalhado": "sons reais do ambiente: vento, passos, roupas, objetos, respiração, silêncio",');

  L.push('"prompt_veo3": "Ultra detailed production-ready Veo3 prompt in English. Must include exact character appearance, exact environment, exact lighting direction and color, exact body movement, exact facial expression, exact interaction, exact camera movement and lens, exact sound environment, and exact spoken Portuguese line. No generic wording."');

  L.push('}');

  return L.join('\\n');
}
