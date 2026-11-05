import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { normaliserEmail, normaliserTel } from '@/lib/telephone'

// Import en lot de prospects (script scripts/import-leads.ts), réservé à une session connectée (proxy.ts).
// Corps : { leads: [{ nom, telephone, email, notes, created_at }] } → « Nouveau prospect », source « Meta Ads ».
// Anti-doublon par téléphone / e-mail, avec la base ET à l'intérieur du lot. Ne renvoie que des compteurs.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const lignes: Record<string, unknown>[] = Array.isArray(body?.leads) ? body.leads.slice(0, 500) : []
  if (lignes.length === 0) return NextResponse.json({ error: 'Aucun prospect' }, { status: 400 })

  const { data: existants, error } = await supabase.from('leads').select('telephone, email')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const tels = new Set((existants ?? []).map(e => e.telephone).filter(Boolean))
  const mails = new Set((existants ?? []).map(e => normaliserEmail(e.email)).filter(Boolean))

  const aCreer = []
  let doublons = 0, invalides = 0
  for (const l of lignes) {
    const nom = String(l.nom ?? '').trim().slice(0, 120)
    const telephone = normaliserTel(String(l.telephone ?? ''))
    const email = normaliserEmail(String(l.email ?? ''))
    const created = String(l.created_at ?? '')
    if (!nom || (!telephone && !email) || Number.isNaN(Date.parse(created))) { invalides++; continue }
    if ((telephone && tels.has(telephone)) || (email && mails.has(email))) { doublons++; continue }
    if (telephone) tels.add(telephone)
    if (email) mails.add(email)
    aCreer.push({
      nom, telephone, email,
      source: 'Meta Ads',
      statut: 'Nouveau prospect',
      notes: String(l.notes ?? '').slice(0, 1000) || null,
      appels: [],
      created_at: new Date(created).toISOString(),
    })
  }
  if (aCreer.length > 0) {
    const { error: e2 } = await supabase.from('leads').insert(aCreer)
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
  }
  return NextResponse.json({ recus: lignes.length, crees: aCreer.length, doublons, invalides })
}
