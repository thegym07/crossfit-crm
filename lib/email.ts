import nodemailer from 'nodemailer'
import { SALLE } from './salle'

// Envoi d'e-mails depuis la vraie boîte de la box (gratuit) : contact@lasallecrossfit.fr chez IONOS.
// Variables d'environnement (Vercel) :
//   SMTP_PASSWORD (mot de passe de la boîte IONOS) suffit ; SMTP_USER (défaut contact@lasallecrossfit.fr),
//   SMTP_HOST (défaut smtp.ionos.fr), SMTP_PORT (défaut 465) facultatifs.
// Repli possible sur une boîte Gmail comme THE GYM : GMAIL_USER + GMAIL_APP_PASSWORD (mot de passe d'application).

function config() {
  if (process.env.SMTP_PASSWORD) {
    const port = Number(process.env.SMTP_PORT || 465)
    const user = process.env.SMTP_USER || SALLE.email
    return {
      user,
      transport: nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.fr',
        port,
        secure: port === 465,
        auth: { user, pass: process.env.SMTP_PASSWORD },
      }),
    }
  }
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return {
      user: process.env.GMAIL_USER,
      transport: nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
      }),
    }
  }
  return null
}

export const emailConfigure = () => config() !== null

/** Adresse d'envoi de la box (sert aussi pour les alertes de panne). */
export const adresseSalle = () => process.env.SMTP_USER || process.env.GMAIL_USER || SALLE.email

export const emailValide = (e: string | null | undefined) =>
  !!e && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())

export type ResultatEmail = { ok: true } | { ok: false; erreur: string }

export async function envoyerEmail(to: string | null | undefined, sujet: string, texte: string): Promise<ResultatEmail> {
  const c = config()
  if (!c) return { ok: false, erreur: 'Envoi d’e-mails pas encore branché (SMTP_PASSWORD manquant dans Vercel)' }
  if (!emailValide(to)) return { ok: false, erreur: 'Adresse e-mail invalide' }

  try {
    await c.transport.sendMail({
      from: { name: SALLE.nom, address: c.user },
      to: to!.trim(),
      subject: sujet,
      text: texte,
      // Repère pour le tri IA de la boîte contact@ (~/crossfit-mail) : notification du CRM, jamais une pub
      headers: { 'X-CRM-LaSalle': 'notification' },
    })
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[EMAIL] échec :', msg)
    return { ok: false, erreur: /Invalid login|535|authentication|Username and Password/i.test(msg) ? 'La messagerie refuse la connexion : vérifie le mot de passe de la boîte' : 'Envoi impossible' }
  }
}
