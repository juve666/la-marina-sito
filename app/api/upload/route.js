import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const folder = formData.get('folder') || 'misc';

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Nessun file ricevuto' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder}/${randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('avatars')
    .upload(path, buffer, { contentType: file.type || 'image/jpeg', upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
