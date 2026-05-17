import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

// PATCH /api/admin/messages/[id] → marquer comme lu/non lu
export async function PATCH(request, { params }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const lu = Boolean(body?.lu)
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('messages').update({ lu }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/messages/[id]
export async function DELETE(request, { params }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
