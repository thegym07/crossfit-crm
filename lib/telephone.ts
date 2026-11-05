// Même format de téléphone partout (webhook Meta, formulaire, import) : c'est la clé de l'anti-doublon.
// « +33 6 12 34 56 78 », « 0033612345678 », « 33612345678 », « 612345678 » → « 0612345678 ».
export function normaliserTel(tel: string | null | undefined): string | null {
  if (!tel) return null
  let t = tel.trim().replace(/[^\d+]/g, '')
  if (t.startsWith('+33')) t = '0' + t.slice(3)
  else if (t.startsWith('0033')) t = '0' + t.slice(4)
  else if (/^33[67]\d{8}$/.test(t)) t = '0' + t.slice(2)
  else if (/^[67]\d{8}$/.test(t)) t = '0' + t
  return t || null
}

export const normaliserEmail = (e: string | null | undefined) => (e ?? '').trim().toLowerCase() || null
