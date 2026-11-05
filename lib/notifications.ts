import { getReglages } from './reglages'
import { adresseSalle, envoyerEmail } from './email'
import { CRM_URL, SALLE } from './salle'
import type { Lead } from './supabase'
import type { Coach, Creneau } from './agenda'

// Notifications par e-mail, déclenchées selon l'onglet Réglages.
// Ne lèvent jamais d'erreur : un e-mail raté ne doit pas bloquer l'arrivée d'un prospect ou une réservation.

const CRM = CRM_URL

/** Nouveau prospect (pub Meta ou formulaire du site) → e-mail à l'adresse choisie dans Réglages (contact@ par défaut). */
export async function notifierNouveauProspect(
  lead: Pick<Lead, 'id' | 'nom' | 'telephone' | 'email' | 'source'>,
  details: string[] = [],
): Promise<void> {
  try {
    const { emailProspects } = await getReglages()
    if (!emailProspects.actif || !emailProspects.email) return
    await envoyerEmail(
      emailProspects.email,
      `🔥 Nouveau prospect : ${lead.nom}`,
      [
        `Bonjour,`,
        ``,
        `Un nouveau prospect vient d'arriver (${lead.source}) :`,
        ``,
        `${lead.nom}`,
        lead.telephone ? `Téléphone : ${lead.telephone}` : null,
        lead.email ? `E-mail : ${lead.email}` : null,
        ...details,
        ``,
        `Rappelle-le vite (dans l'heure si possible) : c'est maintenant qu'il est le plus chaud !`,
        `Sa fiche : ${CRM}/leads/${lead.id}`,
        ``,
        SALLE.nom,
      ].filter(l => l !== null).join('\n'),
    )
  } catch (err) {
    console.error('[NOTIF] nouveau prospect :', err instanceof Error ? err.message : err)
  }
}

/** Prospect Meta qui n'a pas pu être enregistré → e-mail à la boîte de la salle (jamais perdu en silence). */
export async function notifierEchecProspect(details: string[]): Promise<void> {
  try {
    const salle = adresseSalle()
    await envoyerEmail(
      salle,
      `⚠️ Prospect Meta non enregistré dans le CRM`,
      [
        `Bonjour,`,
        ``,
        `Un prospect de la pub Meta n'a pas pu être enregistré dans le CRM (Meta ou la base de données ne répondait pas).`,
        `Meta va renvoyer la demande automatiquement. Si le prospect n'apparaît pas dans le CRM d'ici une heure,`,
        `retrouve-le dans le Centre de prospects Meta : https://business.facebook.com/latest/leads_center`,
        ``,
        ...details.map(d => `• ${d}`),
        ``,
        `CRM ${SALLE.nom}`,
      ].join('\n'),
    )
  } catch (err) {
    console.error('[NOTIF] échec prospect :', err instanceof Error ? err.message : err)
  }
}


/** Créneau réservé → e-mail au coach concerné. */
export async function notifierCoachNouveauRdv(
  coach: Coach | undefined,
  creneau: Creneau,
  lead: Pick<Lead, 'nom' | 'telephone'>,
): Promise<void> {
  try {
    if (!coach?.email) return
    const { emailCoachRdv } = await getReglages()
    if (!emailCoachRdv.actif) return
    const quand = new Date(creneau.debut).toLocaleString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
    })
    await envoyerEmail(
      coach.email,
      `Nouveau RDV ${SALLE.nom} : ${quand}`,
      [
        `Salut ${coach.nom},`,
        ``,
        `Tu as un nouveau RDV : ${quand}`,
        `Avec : ${lead.nom}`,
        lead.telephone ? `Téléphone : ${lead.telephone}` : null,
        ``,
        `Tous tes RDV : ${CRM}/coach/${coach.ical_token}`,
        ``,
        `Bonne séance !`,
        SALLE.nom,
      ].filter(l => l !== null).join('\n'),
    )
  } catch (err) {
    console.error('[NOTIF] RDV coach :', err instanceof Error ? err.message : err)
  }
}
