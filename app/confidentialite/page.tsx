import Image from 'next/image'
import { SALLE } from '@/lib/salle'

export const metadata = { title: 'Politique de confidentialité — La Salle CrossFit' }

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="La Salle CrossFit" width={88} height={88} className="drop-shadow-md" />
          </div>
          <h1 className="text-3xl text-gray-900">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-1 text-sm">{SALLE.nom} — {SALLE.adresse}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="font-bold text-gray-900 mb-1.5">Qui sommes-nous ?</h2>
            <p>
              La Salle CrossFit est une box de CrossFit située {SALLE.adresse} (Ardèche, France), exploitée par
              la SAS THE GYM AUBENAS. La présente politique décrit comment nous collectons et utilisons tes données
              personnelles lorsque tu nous laisses tes coordonnées, notamment via nos formulaires de contact et nos
              publicités Facebook / Instagram.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-1.5">Données collectées</h2>
            <p>
              Lorsque tu remplis un formulaire (sur notre site, à la box ou via une publicité Meta), nous collectons
              uniquement les informations que tu nous transmets : nom, prénom, numéro de téléphone, adresse e-mail et,
              le cas échéant, l’activité qui t’intéresse.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-1.5">Utilisation de tes données</h2>
            <p>
              Ces informations servent exclusivement à te recontacter au sujet de ta demande (séance d’essai,
              rendez-vous, abonnement) et au suivi commercial interne de la box. Elles ne sont jamais vendues,
              louées ni transmises à des tiers à des fins publicitaires.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-1.5">Conservation et sécurité</h2>
            <p>
              Tes données sont stockées de manière sécurisée dans notre outil de gestion interne, accessible
              uniquement à l’équipe de La Salle CrossFit. Elles sont conservées le temps nécessaire au traitement de
              ta demande, puis supprimées.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-1.5">Tes droits</h2>
            <p>
              Conformément au RGPD, tu disposes d’un droit d’accès, de rectification et de suppression de tes
              données. Pour l’exercer, écris-nous à{' '}
              <a href={`mailto:${SALLE.email}`} className="font-semibold text-gray-900 underline">{SALLE.email}</a>,
              appelle le {SALLE.telephone}, ou passe directement à l’accueil de la box. Ta demande sera traitée dans
              les meilleurs délais.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-2">Dernière mise à jour : novembre 2026</p>
        </div>
      </div>
    </div>
  )
}
