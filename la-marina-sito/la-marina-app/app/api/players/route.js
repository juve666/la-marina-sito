import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('players')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('number', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('players')
    .insert({
      number: body.number ? Number(body.number) : null,
      name: body.name,
      role: body.role,
      sort_order: body.sort_order ? Number(body.sort_order) : 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
