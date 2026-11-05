import { createHmac, timingSafeEqual } from 'node:crypto'

// Session signée : le cookie contient une date d'expiration + une signature HMAC.
// Impossible à fabriquer sans le secret serveur (avant : valeur fixe « authenticated »,
// lisible dans le code public). Changer le mot de passe invalide toutes les sessions.
export const SESSION_COOKIE = 'crossfit_session'
export const SESSION_DUREE_S = 60 * 60 * 24 * 30 // 30 jours

function secret(): string {
  const s = process.env.SESSION_SECRET
    || [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.ADMIN_PASSWORD_HASH ?? process.env.ADMIN_PASSWORD].filter(Boolean).join('|')
  if (!s) throw new Error('Secret de session manquant (SESSION_SECRET ou SUPABASE_SERVICE_ROLE_KEY)')
  return s
}

const signer = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url')

function egal(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function creerSession(): string {
  const data = `v1.${Math.floor(Date.now() / 1000) + SESSION_DUREE_S}`
  return `${data}.${signer(data)}`
}

export function sessionValide(valeur: string | undefined | null): boolean {
  if (!valeur) return false
  const [version, exp, sig] = valeur.split('.')
  if (version !== 'v1' || !/^\d+$/.test(exp ?? '') || !sig) return false
  if (Number(exp) < Date.now() / 1000) return false
  try {
    return egal(sig, signer(`v1.${exp}`))
  } catch {
    return false
  }
}

