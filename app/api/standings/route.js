import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .select('*')
    .order('points', { ascending: false })
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('standings')
    .insert({
      team_name: body.team_name,
      played: Number(body.played) || 0,
      won: Number(body.won) || 0,
      drawn: Number(body.drawn) || 0,
      lost: Number(body.lost) || 0,
      goals_for: Number(body.goals_for) || 0,
      goals_against: Number(body.goals_against) || 0,
      points: Number(body.points) || 0,
      sort_order: Number(body.sort_order) || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
