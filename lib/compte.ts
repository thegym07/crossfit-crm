import { supabase } from './supabaseServer'

// Compte de connexion de l'équipe, stocké en base (table reglages, clé « compte ») :
// { identifiant, hash } — hash bcrypt du mot de passe, jamais le mot de passe en clair.
// S'il existe, il remplace ADMIN_USERNAME / ADMIN_PASSWORD de Vercel (qui ne servent plus que de secours).
export type Compte = { identifiant: string; hash: string }

export async function getCompte(): Promise<Compte | null> {
  const { data, error } = await supabase.from('reglages').select('valeur').eq('cle', 'compte').maybeSingle()
  if (error) { console.error('getCompte:', error.message); return null }
  const v = data?.valeur as Partial<Compte> | undefined
  return v?.identifiant && v?.hash ? { identifiant: v.identifiant, hash: v.hash } : null
}
