import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { validateAvis } from '@/lib/validation'

// PATCH /api/admin/avis/[id]
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

  const v = validateAvis(body)
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 422 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('avis')
    .update(v.value)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ avis: data })
}

// DELETE /api/admin/avis/[id]
export async function DELETE(request, { params }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('avis').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
