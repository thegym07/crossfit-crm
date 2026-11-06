import Link from 'next/link'
import { GUIDE } from '@/lib/guide'
import GuideVu from './GuideVu'

export const metadata = { title: 'Guide CRM — La Salle CrossFit' }

type SearchParams = { bienvenue?: string }

export default async function GuidePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { bienvenue } = await searchParams
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-16">
      <GuideVu />

      {bienvenue && (
        <div className="mb-6 rounded-2xl bg-[#0d0d0d] text-white p-5">
          <p className="font-display text-2xl text-[#f8ef9c]">Bienvenue dans le CRM 👋</p>
          <p className="text-sm text-zinc-300 mt-1">
            Prends 3 minutes pour lire ce guide : il t’explique tout. Tu pourras le relire quand tu veux avec l’onglet « Guide CRM ».
          </p>
          <Link href="/leads" className="inline-block mt-3 btn-primary text-sm">J’ai compris, voir les prospects →</Link>
        </div>
      )}

      <h1 className="text-4xl text-gray-900">📖 Guide CRM</h1>
      <p className="text-gray-600 mt-2">{GUIDE.accroche}</p>

      {/* Routine du jour */}
      <section className="mt-6 rounded-2xl border-2 border-[#d9cb4a] bg-[#f8ef9c]/30 p-5">
        <p className="font-display text-2xl text-gray-900">Ta routine chaque jour</p>
        <ol className="mt-3 space-y-2">
          {GUIDE.routine.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-800">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d0d0d] text-[#f8ef9c] text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="pt-0.5">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sommaire */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {GUIDE.sections.map((s, i) => (
          <a key={i} href={`#s${i}`} className="text-xs px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-500">
            {s.icone} {s.titre}
          </a>
        ))}
        <a href="#faq" className="text-xs px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-500">❓ Questions fréquentes</a>
      </nav>

      {/* Onglet par onglet */}
      <div className="mt-6 space-y-3">
        {GUIDE.sections.map((s, i) => (
          <details key={i} id={`s${i}`} className="group rounded-2xl border border-gray-200 bg-white shadow-sm open:shadow-md scroll-mt-4" open={i === 1}>
            <summary className="cursor-pointer select-none list-none p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icone}</span>
              <span className="flex-1">
                <span className="block font-bold text-gray-900">{s.titre}</span>
                <span className="block text-sm text-gray-500">{s.intro}</span>
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-4 pb-4">
              <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-800">
                {s.etapes.map((e, j) => <li key={j}>{e}</li>)}
              </ol>
              {s.astuce && (
                <p className="mt-3 text-sm rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-gray-700">💡 {s.astuce}</p>
              )}
            </div>
          </details>
        ))}
      </div>

      {/* FAQ */}
      <h2 id="faq" className="mt-10 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-widest scroll-mt-4">❓ Questions fréquentes</h2>
      <div className="space-y-2">
        {GUIDE.faq.map((f, i) => (
          <details key={i} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <summary className="cursor-pointer font-semibold text-sm text-gray-900">{f.q}</summary>
            <p className="mt-2 text-sm text-gray-700">{f.r}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/leads" className="btn-primary inline-block">Aller aux prospects →</Link>
      </div>
    </div>
  )
}
