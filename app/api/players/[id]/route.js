import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function PUT(request, { params }) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('players')
    .update({
      number: body.number ? Number(body.number) : null,
      name: body.name,
      role: body.role,
      sort_order: body.sort_order ? Number(body.sort_order) : 0,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const { error } = await supabaseAdmin.from('players').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
