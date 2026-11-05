/**
 * Import initial des leads Meta à rappeler (CSV de l'audit du 05/11/2026) dans le CRM EN LIGNE.
 *   npm run import-leads -- "<chemin du CSV>" [--go]
 * Se connecte au CRM avec ADMIN_USERNAME / ADMIN_PASSWORD (.env.local) puis envoie les lignes à /api/leads/import.
 * Sans --go : simulation (compte les lignes valides, rien n'est envoyé).
 * N'affiche JAMAIS de nom, téléphone ni e-mail : seulement des compteurs.
 * Colonnes (séparateur ;) : Date du lead ; Prénom ; Nom ; Téléphone ; E-mail ; Pub ; Situation ResaWod
 */
import { readFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import { config } from 'dotenv'

config({ path: '.env.local' })
const CRM = process.env.CRM_URL || 'https://crm-lasallecrossfit.vercel.app'

const [chemin, ...options] = process.argv.slice(2)
const go = options.includes('--go')
if (!chemin) throw new Error('Chemin du CSV manquant')

type Ligne = Record<string, string>

async function main() {
  const lignes: Ligne[] = parse(readFileSync(chemin), { columns: true, delimiter: ';', bom: true, skip_empty_lines: true, trim: true })
  const leads = lignes
    .filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l['Date du lead'] ?? ''))
    .map(l => {
      const date = l['Date du lead']
      return {
        nom: [l['Prénom'], l['Nom']].filter(Boolean).join(' ').trim(),
        telephone: l['Téléphone'] || null,
        email: l['E-mail'] || null,
        created_at: `${date}T10:00:00Z`,
        notes: [
          `Origine : pub « ${l['Pub'] || 'Meta'} » (lead du ${date.split('-').reverse().join('/')}, importé le 05/11/2026)`,
          l['Situation ResaWod'] ? `ResaWod au 05/11 : ${l['Situation ResaWod']}` : null,
        ].filter(Boolean).join('\n'),
      }
    })
  console.log(`${lignes.length} lignes dans le CSV · ${leads.length} avec une date valide`)
  if (!go) { console.log('Simulation : rien envoyé (ajouter --go pour importer).'); return }

  const login = await fetch(`${CRM}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0]
  if (!login.ok || !cookie) throw new Error(`Connexion au CRM refusée (${login.status})`)

  const res = await fetch(`${CRM}/api/leads/import`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ leads }),
  })
  const r = await res.json()
  if (!res.ok) throw new Error(`Import refusé (${res.status}) : ${r.error ?? ''}`)
  console.log(`✅ ${r.crees} prospects créés · ${r.doublons} déjà dans le CRM · ${r.invalides} invalides (sur ${r.recus})`)
}

main().catch(err => { console.error('❌', err instanceof Error ? err.message : err); process.exit(1) })
