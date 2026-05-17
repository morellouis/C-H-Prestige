import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { validateAvis } from '@/lib/validation'

// POST /api/admin/avis → créer un avis
export async function POST(request) {
  const denied = await requireAdmin()
  if (denied) return denied

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
    .insert([v.value])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ avis: data })
}
