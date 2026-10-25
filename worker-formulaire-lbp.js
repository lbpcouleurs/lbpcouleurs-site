// Relais formulaire de contact LBP COULEURS (Cloudflare Worker + Resend)
// Secret requis : RESEND_KEY
const ORIGINS = ['https://lbpcouleurs.fr', 'https://www.lbpcouleurs.fr'];
const TO = 'lbp.couleurs@hotmail.com';
const FROM = 'Site LBP COULEURS <formulaire@mail.stackmind.fr>';
const CHAMPS = ['Nom', 'Téléphone', 'E-mail', 'Commune du chantier', 'Type de travaux', 'Projet'];

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST' || !ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403 });

    let d;
    try { d = await req.json(); } catch { return Response.json({ success: false }, { status: 400, headers: cors }); }
    if (d._honey) return Response.json({ success: true }, { headers: cors });

    const val = k => String(d[k] || '').trim().slice(0, 3000);
    if (!val('Nom') || (!val('Téléphone') && !val('E-mail'))) {
      return Response.json({ success: false }, { status: 400, headers: cors });
    }

    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const html = '<h2 style="font-family:sans-serif">Nouvelle demande de devis</h2><table cellpadding="8" style="font-family:sans-serif;border-collapse:collapse">'
      + CHAMPS.map(k => `<tr><td style="border:1px solid #ddd"><b>${k}</b></td><td style="border:1px solid #ddd">${esc(val(k)).replace(/\n/g, '<br>')}</td></tr>`).join('')
      + '</table>';
    const text = CHAMPS.map(k => `${k} : ${val(k)}`).join('\n');
    const email = val('E-mail');

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        ...(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? { reply_to: email } : {}),
        subject: 'Demande de devis · ' + val('Nom'),
        html,
        text,
      }),
    });
    if (!r.ok) console.log('Resend error', r.status, await r.text());
    return Response.json({ success: r.ok }, { status: r.ok ? 200 : 502, headers: cors });
  },
};
