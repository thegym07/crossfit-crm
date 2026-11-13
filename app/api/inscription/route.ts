import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/db'
import { notifierNouveauProspect } from '@/lib/notifications'
import { ACTIVITES } from '@/lib/salle'
import type { Lead } from '@/lib/supabase'
import { normaliserEmail, normaliserTel } from '@/lib/telephone'

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

  // Provenance (/essai?src=…) : lisible sur la fiche prospect, sous « Source »
  const ORIGINES: Record<string, string> = {
    google: 'Fiche Google', 'google-post': 'Post Google', 'google-produit': 'Produit Google', site: 'Site lasallecrossfit.fr', facebook: 'Page Facebook',
  }
  const src = String(body.src ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30)
  const origine = src ? (ORIGINES[src] ?? `Lien « ${src} »`) : 'Page séance d’essai'
  const MOMENTS = ['Le matin', 'Le midi', 'L’après-midi', 'En fin de journée']
  const moment = MOMENTS.includes(body.moment) ? body.moment : ''
  const notes = [moment && `Préfère être rappelé(e) : ${moment.toLowerCase()}`, body.message?.trim()].filter(Boolean).join('\n') || null

  const cree = await createLead({
    nom,
    telephone: normaliserTel(body.telephone),
    email: normaliserEmail(body.email),
    source: 'Formulaire web',
    activite,
    statut: 'Nouveau prospect',
    notes,
    origine,
  })
  await notifierNouveauProspect(cree)

  return NextResponse.json({ success: true })
}
