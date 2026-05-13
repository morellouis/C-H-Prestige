'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAvis, updateAvis } from '@/lib/avis'
import SelecteurEtoiles from './SelecteurEtoiles'

export default function FormulaireAvis({ avis }) {
  const router = useRouter()
  const isEdit = Boolean(avis)

  const [form, setForm] = useState({
    auteur: avis?.auteur || '',
    texte: avis?.texte || '',
    achat: avis?.achat || '',
    note: avis?.note ?? 5,
    publie: avis?.publie ?? true,
    ordre: avis?.ordre ?? 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = { ...form, note: parseFloat(form.note), ordre: parseInt(form.ordre, 10) || 0 }
      if (isEdit) {
        await updateAvis(avis.id, data)
      } else {
        await createAvis(data)
      }
      router.push('/admin/avis')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Auteur *</label>
        <input
          name="auteur"
          value={form.auteur}
          onChange={handleChange}
          required
          placeholder="ex : Alexandre M."
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Témoignage *</label>
        <textarea
          name="texte"
          value={form.texte}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Le texte du témoignage tel qu'il apparaîtra sur le site."
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Produit acheté</label>
        <input
          name="achat"
          value={form.achat}
          onChange={handleChange}
          placeholder="ex : Louis Vuitton Keepall"
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <p className="text-xs text-gray-400 mt-1">Optionnel — apparaît sous le nom de l&apos;auteur.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Note (0.5 à 5) *</label>
          <SelecteurEtoiles
            note={Number(form.note)}
            onChange={(n) => setForm(prev => ({ ...prev, note: n }))}
          />
          <p className="text-xs text-gray-400 mt-1">
            Clique sur la moitié gauche d&apos;une étoile pour un demi-point (ex : 4,5/5).
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ordre d&apos;affichage</label>
          <input
            name="ordre"
            type="number"
            value={form.ordre}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <p className="text-xs text-gray-400 mt-1">Plus petit = affiché en premier.</p>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="publie"
          checked={form.publie}
          onChange={handleChange}
          className="w-4 h-4 accent-[var(--accent)]"
        />
        <span className="text-sm font-medium text-gray-700">Publié sur le site</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer l\'avis'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/avis')}
          className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
