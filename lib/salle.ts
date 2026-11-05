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

/** Adresse publique du CRM (liens dans les e-mails, pages coachs, agenda). */
export const CRM_URL = 'https://crm-lasallecrossfit.vercel.app'

/** Page Facebook « La Salle CrossFit » : seuls ses leads Meta entrent ici. */
export const META_PAGE_ID = '152896994571328'

// ── Rentabilité ──
export const PUB_PAR_JOUR = 10         // dépense publicitaire Meta quotidienne (€)
export const SALAIRE_MENSUEL = 150     // salaire fixe de la personne qui rappelle les prospects (€/mois)
export const DEBUT_ACTIVITE = '2026-11' // début du calcul (mise en service du CRM)

// ── Commissions ──
export const COMMISSION_PAR_RDV = 10   // € par RDV où le prospect était présent (vente ou non)
export const COMMISSION_COACH = 30     // € par séance « avec un coach » réalisée (créneau de l'agenda coachs)

// ── Activités proposées ──
// ACTIVITE_COACH : le RDV se prend sur un créneau de l'agenda coachs (comme le plateau muscu de THE GYM).
export const ACTIVITE_COACH = 'séance avec un coach'
export const ACTIVITES = ['WOD (CrossFit)', 'Hyrox', 'ATHX', ACTIVITE_COACH] as const

// ── Formules vendues ──
// prix = montant unique, ou mensualité si duree > 1 (étalée sur la durée dans Rentabilité).
// Tarifs CrossFit : à renseigner (non publics, formules personnalisées).
export const OFFRES: Record<string, { label: string; prix: number; duree: number }> = {}
