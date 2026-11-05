/**
 * Import initial des leads Meta à rappeler (CSV de l'audit du 05/11/2026).
 *   npm run import-leads -- "<chemin du CSV>" [--go]
 * Sans --go : simulation (rien n'est écrit). N'affiche JAMAIS de nom, téléphone ni e-mail : seulement des compteurs.
 * Colonnes attendues (séparateur ;) : Date du lead ; Prénom ; Nom ; Téléphone ; E-mail ; Pub ; Situation ResaWod
 * Chaque lead → « Nouveau prospect », source « Meta Ads », créé à la date du lead. Anti-doublon par téléphone / e-mail.
 */
import { readFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const [chemin, ...options] = process.argv.slice(2)
const go = options.includes('--go')
if (!chemin) throw new Error('Chemin du CSV manquant')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans .env.local')
const supabase = createClient(url, key, { auth: { persistSession: false } })

const normaliserTel = (t: string) => {
  const s = t.replace(/[\s.-]/g, '')
  if (s.startsWith('+33')) return '0' + s.slice(3)
  if (s.startsWith('0033')) return '0' + s.slice(4)
  return s
}

type Ligne = Record<string, string>

async function main() {
  const lignes: Ligne[] = parse(readFileSync(chemin), { columns: true, delimiter: ';', bom: true, skip_empty_lines: true, trim: true })
  const { data: existants, error } = await supabase.from('leads').select('telephone, email')
  if (error) throw new Error(error.message)
  const tels = new Set((existants ?? []).map(e => e.telephone).filter(Boolean))
  const mails = new Set((existants ?? []).map(e => (e.email ?? '').toLowerCase()).filter(Boolean))

  const aCreer = []
  let doublons = 0
  let invalides = 0
  for (const l of lignes) {
    const date = l['Date du lead']
    const nom = [l['Prénom'], l['Nom']].filter(Boolean).join(' ').trim()
    const telephone = l['Téléphone'] ? normaliserTel(l['Téléphone']) : null
    const email = (l['E-mail'] || '').trim() || null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !nom || (!telephone && !email)) { invalides++; continue }
    if ((telephone && tels.has(telephone)) || (email && mails.has(email.toLowerCase()))) { doublons++; continue }
    if (telephone) tels.add(telephone)
    if (email) mails.add(email.toLowerCase())
    const notes = [
      `Origine : pub « ${l['Pub'] || 'Meta'} » (lead du ${date.split('-').reverse().join('/')}, importé le 05/11/2026)`,
      l['Situation ResaWod'] ? `ResaWod au 05/11 : ${l['Situation ResaWod']}` : null,
    ].filter(Boolean).join('\n')
    aCreer.push({
      nom, telephone, email,
      source: 'Meta Ads',
      statut: 'Nouveau prospect',
      notes,
      appels: [],
      created_at: `${date}T10:00:00+00:00`,
    })
  }

  console.log(`${lignes.length} lignes · ${aCreer.length} à créer · ${doublons} déjà dans le CRM · ${invalides} invalides`)
  if (!go) { console.log('Simulation : rien écrit (ajouter --go pour importer).'); return }
  const { error: e2, count } = await supabase.from('leads').insert(aCreer, { count: 'exact' })
  if (e2) throw new Error(e2.message)
  console.log(`✅ ${count} prospects importés`)
}

main().catch(err => { console.error('❌', err instanceof Error ? err.message : err); process.exit(1) })
