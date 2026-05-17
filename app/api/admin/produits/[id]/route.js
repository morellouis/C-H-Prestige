import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { validateProduit } from '@/lib/validation'

// PATCH /api/admin/produits/[id] → mettre à jour
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

  const v = validateProduit(body)
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 422 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('produits')
    .update(v.value)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ produit: data })
}

// DELETE /api/admin/produits/[id]
export async function DELETE(request, { params }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('produits').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
