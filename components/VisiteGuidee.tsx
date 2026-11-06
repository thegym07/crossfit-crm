'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { VISITE_COOKIE } from '@/lib/exemples'

// Visite guidée du CRM (même principe que la visite de l'app LINEA) : chaque étape ouvre la vraie page
// et éclaire la zone expliquée (attribut data-visite="…", ou la ligne d'un prospect d'exemple data-exemple="…").
// Pendant la visite, un cookie fait apparaître 5 prospects d'EXEMPLE (lib/exemples.ts, jamais enregistrés),
// pour que chaque bouton soit visible même quand le CRM est vide. Les clics sur la page sont bloqués.
// Lancement : 1re connexion sur un appareil (app/login), ou « Guide CRM » dans le menu (lien /?visite=1).
//
// À TENIR À JOUR : toute modification visible du CRM (onglet, bouton, statut, règle) doit être reportée ici.

export const VISITE_VUE = 'visite-crm-vue' // localStorage : visite déjà faite sur cet appareil

interface Etape {
  route: string
  zone?: string // sélecteur CSS de la zone à éclairer (la première visible)
  emoji: string
  titre: React.ReactNode
  texte: React.ReactNode
}

const OU = (tel: string, ordi: string) => (
  <><span className="md:hidden">{tel}</span><span className="hidden md:inline">{ordi}</span></>
)
const ex = (id: string, zone?: string) => `[data-exemple="exemple-${id}"]${zone ? ` [data-visite="${zone}"]` : ''}`
const B = ({ children }: { children: React.ReactNode }) => <strong className="text-gray-900">{children}</strong>

const ETAPES: Etape[] = [
  {
    route: '/', emoji: '👋', titre: 'Bienvenue dans le CRM de La Salle CrossFit',
    texte: <>
      Ici arrivent toutes les personnes qui veulent essayer la box. Ton but : les <B>rappeler vite</B> et leur faire réserver
      leur <B>séance d’essai offerte</B>, puis les suivre jusqu’à l’inscription. On fait le tour en 2 minutes.
      Pendant la visite, des prospects d’exemple (« … Exemple ») sont affichés : ils disparaissent à la fin.
    </>,
  },
  {
    route: '/', zone: '[data-visite="menu"]', emoji: '🧭', titre: OU('Le menu, en bas de l’écran', 'Le menu, à gauche'),
    texte: <>
      <B>Dashboard</B> (ta journée), <B>Prospects</B> (les appels à passer), <B>RDV &amp; Relances</B> (les séances d’essai et le suivi).
      {OU(' Le reste (Rapport, Commission Bonus, Rentabilité, Réglages) est dans « ⋯ Plus ».', ' Puis Rapport, Commission Bonus, Rentabilité et Réglages.')}
      {' '}« Guide CRM » relance cette visite quand tu veux.
    </>,
  },
  {
    route: '/', zone: '[data-visite="rdv-du-jour"]', emoji: '📅', titre: 'Les séances d’essai du jour',
    texte: <>Chaque matin, regarde ici qui vient aujourd’hui, avec l’heure. Le 📞 appelle directement la personne.</>,
  },
  {
    route: '/', zone: '[data-visite="dorment"]', emoji: '😴', titre: 'Les prospects qui dorment',
    texte: <>
      Ceux que personne n’a appelés ni contactés par SMS depuis <B>plus de 48 h</B>. Chaque prospect coûte de la pub :
      ton objectif, c’est « Personne ne dort — tout le monde a été rappelé 🎉 ».
    </>,
  },
  {
    route: '/leads', zone: ex('julie'), emoji: '👥', titre: 'Un nouveau prospect',
    texte: <>
      Les personnes qui remplissent la pub Facebook / Instagram arrivent <B>toutes seules</B> ici, en « Nouveau prospect »,
      avec leur nom et leur numéro (le bouton ⎘ le copie). La pub d’origine est sur leur fiche, sous « Source ».
      <B>Il n’y a pas d’alerte</B> : ouvre le CRM plusieurs fois par jour.
      En haut de la liste : ceux à appeler aujourd’hui, les plus récents d’abord. Touche le numéro pour appeler.
    </>,
  },
  {
    route: '/leads', zone: ex('julie', 'appel'), emoji: '📞', titre: 'Après chaque appel, un clic',
    texte: <>
      Personne n’a décroché ? <B>« 📞 Pas répondu »</B> : le CRM programme lui-même le prochain appel
      (1 jour, puis 1 jour, 2 jours, 3 jours, 7 jours plus tard). Au 6e appel sans réponse, il te dira de le classer « Perdu ».
      Tu as eu la personne ? <B>« ✓ A répondu »</B>. Un mauvais clic : touche le compteur d’appels, puis « Annuler le dernier ».
    </>,
  },
  {
    route: '/leads', zone: ex('thomas', 'sms'), emoji: '💬', titre: 'Le SMS déjà écrit',
    texte: <>
      Après un premier appel sans réponse, le bouton <B>« 💬 SMS »</B> ouvre l’appli Messages de ton téléphone avec le texte
      déjà écrit (au tutoiement). Tu n’as plus qu’à appuyer sur envoyer.
    </>,
  },
  {
    route: '/leads', zone: ex('julie', 'statut'), emoji: '✅', titre: 'Tu as eu la personne ? Choisis la suite',
    texte: <>
      Dans ce menu : <B>« RDV pris → »</B> si elle réserve sa séance d’essai, ou <B>« À rappeler → »</B> si elle veut qu’on la rappelle plus tard.
      Elle quitte alors « Prospects » et passe dans l’onglet <B>RDV &amp; Relances</B>.
    </>,
  },
  {
    route: '/leads', zone: ex('julie', 'perdu'), emoji: '🚫', titre: 'Pas intéressée : « Perdu »',
    texte: <>
      On ne supprime jamais : touche <B>« Perdu »</B> et choisis le motif (Pas intéressé, Injoignable, Trop loin, Prix…).
      La fiche est rangée dans le filtre « Perdus », d’où « ↩ Remettre en prospect » la fait revenir si la personne rappelle.
    </>,
  },
  {
    route: '/leads', zone: '[data-visite="nouveau"]', emoji: '➕', titre: 'Quelqu’un passe à la box ?',
    texte: <>
      <B>« + Nouveau »</B> ajoute une personne à la main (passage, bouche-à-oreille). Si tu remplis la date du RDV,
      elle part directement dans RDV &amp; Relances.
    </>,
  },
  {
    route: '/show-up', zone: ex('lea'), emoji: '🗓️', titre: 'Les séances d’essai réservées',
    texte: <>
      Chaque « RDV pris » est ici avec sa date. Pas encore de date ? Touche « 📅 Ajouter la date ».
      Envoie le SMS proposé : <B>« 💬 Confirmer »</B> pour un RDV plus tard, <B>« 💬 Rappel »</B> la veille ou le jour même.
      C’est ce qui fait venir les gens.
    </>,
  },
  {
    route: '/show-up', zone: ex('marc'), emoji: '🏋️', titre: 'Après la séance : présence puis résultat',
    texte: <>
      Un RDV passé reste en haut tant qu’il n’est pas rempli. Mets la présence ({OU('« Présent ✓ » / « Absent »', '« Oui ✓ » / « Non »')}), puis le résultat :
      <B> « Vente ✓ »</B> (choisis ensuite la formule), <B>« À rappeler → »</B> ou <B>« Refus »</B>.
      Chaque personne venue te rapporte <B>10 €</B> de commission, qu’elle achète ou non.
    </>,
  },
  {
    route: '/show-up', zone: '[data-visite="relances"]', emoji: '🔁', titre: 'Les relances',
    texte: <>
      <B>« À rappeler »</B> : eus au téléphone mais pas encore de RDV. <B>« Post-séance »</B> : déjà venus, ou absents à leur RDV.
      Les plus urgents sont en haut. Appelle, touche <B>« 📞 Relancé »</B>, puis choisis le suivi : « RDV repris → » les renvoie en Rendez-vous.
    </>,
  },
  {
    route: '/rapport', zone: '[data-visite="rapport"]', emoji: '📋', titre: 'Le rapport du soir (1 minute)',
    texte: <>
      Les appels du jour sont déjà comptés à partir de tes clics. Écris le nombre de <B>RDV pris</B>, coche
      « 📱 SMS de relance envoyés ? » : tout s’enregistre tout seul.
    </>,
  },
  {
    route: '/commissions', zone: '[data-visite="commission-mois"]', emoji: '💶', titre: 'Ta commission',
    texte: <>
      <B>10 € par RDV où la personne est venue</B>, vente ou non. Elle se compte toute seule quand tu mets la présence sur {OU('« Présent ✓ »', '« Oui ✓ »')}.
      Ici, le total du mois ; plus bas, l’historique.
    </>,
  },
  {
    route: '/rentabilite', zone: '[data-visite="rentabilite"]', emoji: '📈', titre: 'Est-ce que ça rapporte ?',
    texte: <>
      Le résultat du mois : les ventes (selon la formule choisie) moins la pub, le salaire et les commissions.
      Pour le faire monter : rappeler vite, confirmer chaque RDV par SMS et noter chaque vente avec sa formule.
    </>,
  },
  {
    route: '/', emoji: '🎉', titre: 'Tu es prêt !',
    texte: <>
      Ta routine : le Dashboard le matin, les appels dans Prospects, les RDV et relances, puis le rapport le soir.
      Tu peux revoir cette visite quand tu veux avec <B>« Guide CRM »</B> dans le menu.
    </>,
  },
]

interface Cadre { top: number; left: number; width: number; height: number }

function trouverZone(selecteur: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selecteur))
  return els.find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }) ?? null
}

const estFixe = (el: HTMLElement) => {
  for (let e: HTMLElement | null = el; e; e = e.parentElement) {
    if (getComputedStyle(e).position === 'fixed') return true
  }
  return false
}

const poserCookie = (actif: boolean) => {
  document.cookie = actif
    ? `${VISITE_COOKIE}=1; path=/; max-age=3600; samesite=lax`
    : `${VISITE_COOKIE}=; path=/; max-age=0; samesite=lax`
}
const cookiePose = () => document.cookie.split('; ').some(c => c === `${VISITE_COOKIE}=1`)

export default function VisiteGuidee() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const demande = searchParams.get('visite') === '1'

  const [actif, setActif] = useState(false)
  const [i, setI] = useState(0)
  const [cadre, setCadre] = useState<Cadre | null>(null)
  const [carteEnHaut, setCarteEnHaut] = useState(false)
  const carteRef = useRef<HTMLDivElement>(null)
  const zoneRef = useRef<HTMLElement | null>(null)

  // Nettoyage (une seule fois, à l'ouverture) d'un cookie resté d'une visite interrompue par un rechargement
  const lance = useRef(false)
  useEffect(() => {
    if (!demande && cookiePose()) {
      poserCookie(false)
      router.refresh()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Lancement : ?visite=1 (1re connexion ou « Guide CRM » dans le menu)
  useEffect(() => {
    if (!demande || lance.current) return
    lance.current = true
    poserCookie(true)
    setI(0)
    setActif(true)
    router.replace(pathname) // retire ?visite=1 de l'adresse ; la page se recharge avec les exemples
  }, [demande]) // eslint-disable-line react-hooks/exhaustive-deps

  const terminer = useCallback(() => {
    poserCookie(false)
    try { localStorage.setItem(VISITE_VUE, '1') } catch {}
    lance.current = false
    setActif(false)
    setCadre(null)
    zoneRef.current = null
    router.refresh() // les prospects d'exemple disparaissent
  }, [router])

  const etape = ETAPES[i]
  const derniere = i === ETAPES.length - 1

  // Changement d'étape : ouvrir la bonne page, attendre la zone, la faire défiler sous les yeux
  useEffect(() => {
    if (!actif) return
    if (pathname !== etape.route) router.push(etape.route)
    zoneRef.current = null
    setCadre(null)
    if (!etape.zone) return
    let essais = 0
    const zone = etape.zone
    const minuteur = setInterval(() => {
      const el = trouverZone(zone)
      if (el || ++essais >= 80) clearInterval(minuteur)
      if (!el) return
      zoneRef.current = el
      if (!estFixe(el)) {
        const mobile = window.innerWidth < 768
        const haut = el.getBoundingClientRect().top + window.scrollY - (mobile ? 90 : 32)
        window.scrollTo({ top: Math.max(0, haut), behavior: 'smooth' })
      }
    }, 100)
    return () => clearInterval(minuteur)
  }, [actif, i, pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Suivi continu de la zone éclairée (défilement, chargement, rotation)
  useLayoutEffect(() => {
    if (!actif) return
    let raf = 0
    const suivre = () => {
      const el = zoneRef.current
      let c: Cadre | null = null
      if (el && el.isConnected) {
        const r = el.getBoundingClientRect()
        const top = Math.max(r.top, 0)
        const bas = Math.min(r.bottom, window.innerHeight)
        if (bas > top) c = { top, left: r.left, width: r.width, height: bas - top }
      } else if (el) {
        zoneRef.current = null
      }
      setCadre(prev => {
        if (!c || !prev) return c
        const pareil = Math.abs(prev.top - c.top) < 1 && Math.abs(prev.left - c.left) < 1 &&
          Math.abs(prev.width - c.width) < 1 && Math.abs(prev.height - c.height) < 1
        return pareil ? prev : c
      })
      const hCarte = carteRef.current?.offsetHeight ?? 260
      const basLibre = window.innerHeight - hCarte - (window.innerWidth < 768 ? 80 : 40)
      setCarteEnHaut(c ? c.top + c.height > basLibre && c.top > hCarte + 80 : false)
      raf = requestAnimationFrame(suivre)
    }
    raf = requestAnimationFrame(suivre)
    return () => cancelAnimationFrame(raf)
  }, [actif])

  if (!actif) return null

  const marge = 6
  return (
    <>
      {/* Bloque les clics sur la page (et le menu) pendant la visite */}
      <div className="fixed inset-0 z-[60]" />
      {cadre ? (
        <div className="fixed z-[61] rounded-2xl pointer-events-none transition-all duration-300 ring-[3px] ring-[#f8ef9c]"
          style={{
            top: cadre.top - marge, left: cadre.left - marge,
            width: cadre.width + marge * 2, height: cadre.height + marge * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }} />
      ) : (
        <div className="fixed inset-0 z-[61] bg-black/60 pointer-events-none" />
      )}
      <div ref={carteRef} role="dialog" aria-modal="true" aria-label="Visite guidée du CRM"
        className={`fixed z-[70] inset-x-3 md:inset-x-auto md:right-8 md:w-[420px] bg-white rounded-3xl shadow-2xl p-5 ${
          carteEnHaut
            ? 'top-[calc(16px+env(safe-area-inset-top))] md:top-8'
            : 'bottom-[calc(16px+env(safe-area-inset-bottom))] md:bottom-8'
        }`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 max-w-[140px] h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#0d0d0d] rounded-full transition-all duration-300" style={{ width: `${((i + 1) / ETAPES.length) * 100}%` }} />
            </div>
            <span className="text-xs text-gray-400">{i + 1}/{ETAPES.length}</span>
          </div>
          {!derniere && (
            <button onClick={terminer} className="text-sm text-gray-400 hover:text-gray-600 px-1 py-1">
              Passer ✕
            </button>
          )}
        </div>
        <p className="text-lg font-bold text-gray-900 leading-snug"><span className="mr-1.5">{etape.emoji}</span>{etape.titre}</p>
        <div className="text-[15px] text-gray-600 leading-relaxed mt-2">{etape.texte}</div>
        <div className="flex items-center gap-2 mt-5">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} aria-label="Étape précédente"
              className="min-h-[48px] w-12 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-500 text-xl active:bg-gray-50">
              ‹
            </button>
          )}
          <button onClick={() => (derniere ? terminer() : setI(i + 1))}
            className="flex-1 min-h-[48px] rounded-2xl bg-[#0d0d0d] text-[#f8ef9c] text-base font-bold active:bg-black">
            {i === 0 ? 'C’est parti' : derniere ? 'Commencer' : 'Suivant'}
          </button>
        </div>
      </div>
    </>
  )
}
