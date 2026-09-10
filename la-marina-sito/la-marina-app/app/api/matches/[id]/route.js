import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function PUT(request, { params }) {
  const body = await request.json();
  const { scorers, ...m } = body;

  const isPlayed = m.status === 'played';

  const { data: match, error } = await supabaseAdmin
    .from('matches')
    .update({
      giornata: m.giornata ? Number(m.giornata) : null,
      match_date: m.match_date || null,
      match_time: m.match_time || null,
      opponent: m.opponent,
      is_home: !!m.is_home,
      our_score: isPlayed && m.our_score !== '' ? Number(m.our_score) : null,
      their_score: isPlayed && m.their_score !== '' ? Number(m.their_score) : null,
      status: m.status || 'upcoming',
      location: m.location || null,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sostituisce sempre i marcatori esistenti con quelli inviati
  await supabaseAdmin.from('scorers').delete().eq('match_id', params.id);

  if (isPlayed && Array.isArray(scorers) && scorers.length > 0) {
    const rows = scorers
      .filter((s) => s.player_name && s.player_name.trim() !== '')
      .map((s) => ({
        match_id: params.id,
        player_name: s.player_name,
        goals: s.goals ? Number(s.goals) : 1,
      }));

    if (rows.length > 0) {
      const { error: scErr } = await supabaseAdmin.from('scorers').insert(rows);
      if (scErr) return NextResponse.json({ error: scErr.message }, { status: 500 });
    }
  }

  return NextResponse.json(match);
}

export async function DELETE(request, { params }) {
  // I marcatori collegati vengono eliminati automaticamente (ON DELETE CASCADE)
  const { error } = await supabaseAdmin.from('matches').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
