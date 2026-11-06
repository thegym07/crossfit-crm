// ─────────────────────────────────────────────────────────────
// La Salle CrossFit — tout ce qui est propre à la box, au même endroit.
// (Le reste du code est identique au CRM THE GYM.)
// ─────────────────────────────────────────────────────────────

export const SALLE = {
  nom: 'La Salle CrossFit',
  adresse: '38 rue d’Alès, 07200 Saint-Sernin',
  adresseCourte: '38 rue d’Alès à Saint-Sernin',
  telephone: '04 75 36 40 52',
  email: 'contact@lasallecrossfit.fr',
  site: 'https://www.lasallecrossfit.fr',
} as const

/** Adresse publique du CRM (liens dans les e-mails). */
export const CRM_URL = 'https://crm-lasallecrossfit.vercel.app'

/** Page Facebook « La Salle CrossFit » : seuls ses leads Meta entrent ici. */
export const META_PAGE_ID = '152896994571328'

// ── Rentabilité ──
export const PUB_PAR_JOUR = 10         // dépense publicitaire Meta quotidienne (€)
export const SALAIRE_MENSUEL = 150     // salaire fixe de la personne qui rappelle les prospects (€/mois)
export const DEBUT_ACTIVITE = '2026-11' // début du calcul (mise en service du CRM)

// ── Commissions ──
export const COMMISSION_PAR_RDV = 10   // € par RDV où le prospect était présent (vente ou non)

// ── Activités proposées ── (pas d'agenda coachs : onglet retiré à la demande de Vincent le 06/11/2026)
export const ACTIVITES = ['WOD (CrossFit)', 'Hyrox', 'ATHX'] as const

// ── Formules vendues (tarifs donnés par Vincent le 06/11/2026) ──
// prix = montant unique, ou mensualité si duree > 1 (étalée sur la durée dans Rentabilité).
// Sans engagement : compté 1 mois (la suite n'est pas suivie dans le CRM).
export const OFFRES: Record<string, { label: string; prix: number; duree: number }> = {
  'Carte 10 séances':            { label: 'Carte 10 séances — 130 €',                               prix: 130, duree: 1 },
  '2 séances/sem sans engagement': { label: '2 séances/sem sans engagement — 80 €/mois',            prix: 80,  duree: 1 },
  'Illimité sans engagement':    { label: 'Illimité sans engagement — 100 €/mois',                  prix: 100, duree: 1 },
  '2 séances/sem 12 mois':       { label: '2 séances/sem engagement 12 mois — 65 €/mois (780 €)',   prix: 65,  duree: 12 },
  'Illimité 12 mois':            { label: 'Illimité engagement 12 mois — 85 €/mois (1 020 €)',      prix: 85,  duree: 12 },
}
