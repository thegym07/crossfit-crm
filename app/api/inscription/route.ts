import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/db'
import { notifierNouveauProspect } from '@/lib/notifications'
import { ACTIVITES } from '@/lib/salle'
import type { Lead } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const nom = (body.nom ?? '').trim()
  if (!nom) {
    return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 })
  }

  const activite = (ACTIVITES as readonly string[]).includes(body.activite) ? (body.activite as Lead['activite']) : null

  const cree = await createLead({
    nom,
    telephone: body.telephone?.trim() || null,
    email: body.email?.trim() || null,
    source: 'Formulaire web',
    activite,
    statut: 'Nouveau prospect',
    notes: body.message?.trim() || null,
  })
  await notifierNouveauProspect(cree)

  return NextResponse.json({ success: true })
}
