import { ACTIVITES as ACTIVITES_SALLE, OFFRES } from './salle'

export type Lead = {
  id: string
  nom: string
  telephone: string | null
  email: string | null
  source: 'Meta Ads' | 'Bouche-à-oreille' | 'Passage' | 'Formulaire web' | 'Autre'
  date_rdv: string | null
  activite: (typeof ACTIVITES_SALLE)[number] | null
  rdv_honore: boolean | null
  resultat_rdv: 'Vendu' | 'À relancer' | 'Refus' | null
  statut: 'Nouveau prospect' | 'Contacté sans réponse' | 'À relancer' | 'RDV pris' | 'Vendu' | 'Refus' | 'Perdu'
  offre_souscrite: string | null
  coach_assigne: string | null
  date_relance: string | null  // prochain appel prévu (YYYY-MM-DD)
  motif_relance: string | null // pourquoi relancer ; pour un « Perdu » : « Perdu : <motif> »
  suivi_relance: 'À appeler' | 'Pas de réponse' | 'RDV repris' | 'Perdu' | null
  notes: string | null
  appels: string[]            // historique de contact : ISO ou ISO|nr|rep|sms (voir lib/appels.ts)
  vendu_le: string | null     // date réelle de la vente (figée au passage en Vendu)
  diagnostic: Record<string, unknown> | null // colonne héritée du CRM THE GYM (Bilan Forme), inutilisée ici
  origine: string | null      // pub Meta d'origine : « pub « X » · formulaire « Y » »
  meta_ids: string[]          // identifiants des leads Meta déjà traités (anti-doublon du webhook)
  created_at: string
  updated_at: string
}

// Statuts du parcours prospect (formulaire + liste)
export const STATUTS = ['Nouveau prospect', 'Contacté sans réponse', 'À relancer', 'RDV pris'] as const

// Prospect sorti de l'entonnoir sans vente : archivé (jamais supprimé), avec son motif.
export const MOTIFS_PERTE = ['Pas intéressé', 'Injoignable', 'Trop loin', 'Prix', 'Inscrit ailleurs', 'Autre'] as const
export const PREFIXE_PERTE = 'Perdu : '

export const SOURCES = ['Meta Ads', 'Bouche-à-oreille', 'Passage', 'Formulaire web', 'Autre'] as const

// Formules vendues : définies dans lib/salle.ts (OFFRES), lues aussi par la page Rentabilité
export const FORMULES = Object.entries(OFFRES).map(([value, o]) => ({ value, label: o.label }))
export const ACTIVITES = ACTIVITES_SALLE

// Palette harmonisée : gris = en attente, jaune = à traiter, vert = positif, rouge = négatif
export const STATUT_COLORS: Record<string, string> = {
  'Nouveau prospect':        'bg-green-100 text-green-700 border-green-300',
  'Contacté sans réponse':   'bg-gray-100 text-gray-600 border-gray-300',
  'À relancer':              'bg-[#f8ef9c] text-black border-yellow-500',
  'RDV pris':                'bg-gray-900 text-[#f8ef9c] border-gray-900',
  'Vendu':                   'bg-green-100 text-green-700 border-green-300',
  'Refus':                   'bg-red-100 text-red-600 border-red-200',
  'Perdu':                   'bg-gray-100 text-gray-500 border-gray-300',
}
