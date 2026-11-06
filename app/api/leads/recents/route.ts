import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { emailConfigure } from '@/lib/email'

// PUBLIC, sans aucune donnée personnelle : horodatage + source des prospects arrivés ces 3 derniers jours.
// Sert au robot de la boîte contact@ (~/crossfit-mail, notif_crm.py) pour déposer l'alerte « nouveau prospect »
// dans la boîte tant que le CRM n'envoie pas lui-même d'e-mail (SMTP_PASSWORD absent de Vercel).
export const dynamic = 'force-dynamic'

export async function GET() {
  const depuis = new Date(Date.now() - 3 * 86400000).toISOString()
  const { data, error } = await supabase
    .from('leads')
    .select('created_at, source')
    .gte('created_at', depuis)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'Base indisponible' }, { status: 503 })
  return NextResponse.json({
    emailDirect: emailConfigure(), // le CRM envoie déjà ses e-mails : le robot ne double pas
    prospects: (data ?? []).map(l => ({ cree: l.created_at, source: l.source })),
  })
}
