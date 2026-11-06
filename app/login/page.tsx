'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { VISITE_VUE } from '@/components/VisiteGuidee'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      // Première connexion sur cet appareil : visite guidée du CRM
      let dejaVu = true
      try { dejaVu = localStorage.getItem(VISITE_VUE) === '1' } catch {}
      router.push(dejaVu ? '/' : '/?visite=1')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Identifiants incorrects')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="La Salle CrossFit"
              width={90}
              height={90}
              className="drop-shadow-md"
            />
          </div>
          <h1 className="text-4xl text-gray-900">La Salle CrossFit</h1>
          <p className="text-gray-500 mt-1 text-sm">CRM Prospects — Saint-Sernin</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Identifiant</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              className="input-field"
              placeholder="contact@lasallecrossfit.fr"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl disabled:opacity-50 mt-2 text-base"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
