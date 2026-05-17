'use client'
import { useState } from 'react'
import { envoyerMessage } from '@/lib/messages'

export default function FormulaireContact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '', website: '' })
  const [statut, setStatut] = useState('idle') // idle | sending | success | error
  const [erreur, setErreur] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatut('sending')
    setErreur('')
    try {
      await envoyerMessage(form)
      setStatut('success')
      setForm({ nom: '', email: '', sujet: '', message: '', website: '' })
    } catch (err) {
      setStatut('error')
      setErreur(err.message || "Une erreur est survenue.")
    }
  }

  if (statut === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Message envoyé ✓</h2>
        <p className="text-green-700">Merci pour votre message, nous vous répondrons rapidement.</p>
        <button
          onClick={() => setStatut('idle')}
          className="mt-4 text-sm underline text-green-700 hover:text-green-900"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-3xl p-8 lg:p-10 flex flex-col gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      <h2 className="font-display text-2xl mb-2">Envoyez-nous un message</h2>

      {/* Honeypot anti-bot : invisible pour les humains, rempli par les bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden" tabIndex={-1}>
        <label>Ne pas remplir ce champ
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nom</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="bg-white border border-black/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white border border-black/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Sujet</label>
        <input
          name="sujet"
          value={form.sujet}
          onChange={handleChange}
          className="bg-white border border-black/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
          className="bg-white border border-black/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all resize-none min-h-[140px]"
        />
      </div>

      {statut === 'error' && <p className="text-red-500 text-sm">{erreur}</p>}

      <button
        type="submit"
        disabled={statut === 'sending'}
        className="btn-prestige btn-prestige-gold self-start mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {statut === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  )
}
