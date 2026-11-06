import type { Lead } from './supabase'

// Prospects d'EXEMPLE affichés uniquement pendant la visite guidée (cookie VISITE_COOKIE posé par
// components/VisiteGuidee.tsx). Jamais écrits en base : ils n'existent qu'en mémoire, le temps de la visite,
// pour que chaque bouton expliqué soit visible même quand le CRM est vide.
export const VISITE_COOKIE = 'crm_visite'
export const estExemple = (id: string) => id.startsWith('exemple-')

const il_y_a = (ms: number) => new Date(Date.now() - ms).toISOString()
const H = 3600 * 1000
const jourParis = (decalageJours: number) =>
  new Date(Date.now() + decalageJours * 86400000).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
/** Aujourd'hui (ou un autre jour) à heure fixe, heure de Paris approximée (UTC+1). */
const aHeure = (decalageJours: number, h: number) => new Date(`${jourParis(decalageJours)}T${String(h - 1).padStart(2, '0')}:00:00Z`).toISOString()

const base = (id: string, nom: string, tel: string): Lead => ({
  id, nom, telephone: tel, email: null, source: 'Meta Ads', date_rdv: null, activite: null,
  rdv_honore: null, resultat_rdv: null, statut: 'Nouveau prospect', offre_souscrite: null, coach_assigne: null,
  date_relance: null, motif_relance: null, suivi_relance: null, notes: null, appels: [], vendu_le: null,
  diagnostic: null, origine: null, meta_ids: [], created_at: il_y_a(5 * 60 * 1000), updated_at: il_y_a(5 * 60 * 1000),
})

export function exemplesVisite(): Lead[] {
  return [
    { ...base('exemple-julie', 'Julie Exemple', '0600000001'),
      origine: 'pub « Ta 1re séance offerte » · formulaire « Séance offerte La salle CrossFit new »' },
    { ...base('exemple-thomas', 'Thomas Exemple', '0600000002'), statut: 'Contacté sans réponse',
      created_at: il_y_a(96 * H), updated_at: il_y_a(72 * H), appels: [`${il_y_a(72 * H).replace(/\.\d+Z$/, '.000Z')}|nr`],
      date_relance: jourParis(0) },
    { ...base('exemple-lea', 'Léa Exemple', '0600000003'), statut: 'RDV pris', activite: 'WOD (CrossFit)',
      created_at: il_y_a(48 * H), date_rdv: Date.now() < Date.parse(aHeure(0, 19)) ? aHeure(0, 19) : aHeure(1, 19), appels: [`${il_y_a(46 * H).replace(/\.\d+Z$/, '.000Z')}|rep`] },
    { ...base('exemple-marc', 'Marc Exemple', '0600000004'), statut: 'RDV pris', activite: 'Hyrox',
      created_at: il_y_a(120 * H), date_rdv: aHeure(-1, 18), rdv_honore: true,
      appels: [`${il_y_a(110 * H).replace(/\.\d+Z$/, '.000Z')}|rep`] },
    { ...base('exemple-sarah', 'Sarah Exemple', '0600000005'), statut: 'À relancer',
      created_at: il_y_a(72 * H), motif_relance: 'Veut commencer après les vacances',
      appels: [`${il_y_a(50 * H).replace(/\.\d+Z$/, '.000Z')}|rep`] },
  ]
}
