// SMS pré-écrits, envoyés depuis le téléphone de la commerciale (gratuit) :
// le bouton ouvre l'application Messages avec le texte prêt, il ne reste qu'à envoyer.
// Tutoiement (règle de la box), court, signé « La Salle CrossFit ». Modifier les textes ici.

import type { Lead } from './supabase'
import { SALLE } from './salle'

const SIGNATURE = SALLE.nom

export const prenom = (nom: string) => nom.trim().split(/\s+/)[0] || ''

/** Lien qui ouvre Messages avec le texte (format compris par iPhone et Android). */
export function lienSms(telephone: string, texte: string): string {
  return `sms:${telephone.replace(/\s/g, '')}?&body=${encodeURIComponent(texte)}`
}

const quand = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })
    .replace(':', 'h')

const heure = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).replace(':', 'h')

const jourParis = (ms: number) => new Date(ms).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })

export const SMS = {
  injoignable: (p: string, aDemandeEssai: boolean) =>
    `Salut ${p}, c'est La Salle CrossFit à Saint-Sernin. ${aDemandeEssai ? "Tu as demandé ta séance d'essai offerte : j'ai essayé de t'appeler." : "J'ai essayé de t'appeler au sujet de ta séance d'essai offerte."} Quand est-ce que je peux te rappeler ? Tu peux aussi me répondre ici avec le jour qui t'arrange. ${SIGNATURE}`,
  relance: (p: string) =>
    `Salut ${p}, ta séance d'essai offerte à La Salle CrossFit t'attend toujours. Dis-moi simplement le jour et l'heure qui t'arrangent, je te réserve ta place. ${SIGNATURE}`,
  confirmation: (p: string, dateRdv: string) =>
    `Salut ${p}, c'est noté pour ta séance d'essai offerte à La Salle CrossFit le ${quand(dateRdv)}. Adresse : ${SALLE.adresseCourte}. Prévois une tenue de sport et une bouteille d'eau. Tous niveaux, les coachs adaptent tout. À très vite ! ${SIGNATURE}`,
  rappel: (p: string, dateRdv: string, jour: "aujourd'hui" | 'demain') =>
    `Salut ${p}, petit rappel : ta séance d'essai à La Salle CrossFit, c'est ${jour} à ${heure(dateRdv)}. Un empêchement ? Réponds simplement à ce message. ${SIGNATURE}`,
  apresSeance: (p: string) =>
    `Salut ${p}, merci pour ta venue à La Salle CrossFit ! Comment s'est passée ta séance ? Si tu veux continuer, je te prépare la formule la plus adaptée à ton rythme. ${SIGNATURE}`,
  absent: (p: string) =>
    `Salut ${p}, ta séance d'essai à La Salle CrossFit n'a pas pu avoir lieu. Pas de souci : dis-moi le jour qui t'arrange et on la refixe. ${SIGNATURE}`,
}

/** SMS à proposer pour un RDV à venir : rappel s'il a lieu aujourd'hui ou demain, sinon confirmation. */
export function smsRdv(lead: Pick<Lead, 'nom' | 'date_rdv'>): { label: string; texte: string } | null {
  if (!lead.date_rdv || new Date(lead.date_rdv).getTime() < Date.now()) return null
  const p = prenom(lead.nom)
  const jour = jourParis(new Date(lead.date_rdv).getTime())
  if (jour === jourParis(Date.now())) return { label: 'Rappel', texte: SMS.rappel(p, lead.date_rdv, "aujourd'hui") }
  if (jour === jourParis(Date.now() + 86400000)) return { label: 'Rappel', texte: SMS.rappel(p, lead.date_rdv, 'demain') }
  return { label: 'Confirmer', texte: SMS.confirmation(p, lead.date_rdv) }
}

/**
 * SMS pour un prospect pas encore joint (onglet Prospects) : seulement après au moins un appel.
 * « Tu as demandé ta séance » n'est dit qu'aux personnes qui l'ont vraiment demandée.
 */
export function smsProspect(lead: Pick<Lead, 'nom' | 'source'>, nbAppels: number): string | null {
  if (nbAppels === 0) return null
  const p = prenom(lead.nom)
  if (nbAppels > 1) return SMS.relance(p)
  const aDemande = lead.source === 'Meta Ads' || lead.source === 'Formulaire web'
  return SMS.injoignable(p, aDemande)
}

/** SMS à proposer dans les relances, selon ce qui s'est passé. */
export function smsRelance(lead: Pick<Lead, 'nom' | 'rdv_honore'>): string {
  const p = prenom(lead.nom)
  if (lead.rdv_honore === true) return SMS.apresSeance(p)
  if (lead.rdv_honore === false) return SMS.absent(p)
  return SMS.relance(p)
}
