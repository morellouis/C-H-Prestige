'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createProduit, updateProduit, uploadImages } from '@/lib/produits'

export default function FormulaireProduit({ produit }) {
  const router = useRouter()
  const isEdit = Boolean(produit)

  // Liste unifiée d'images : URLs (existantes) + Files (nouveaux uploads)
  const initialImages = produit?.images?.length
    ? produit.images
    : produit?.image_url
    ? [produit.image_url]
    : []

  const [form, setForm] = useState({
    nom: produit?.nom || '',
    description: produit?.description || '',
    prix: produit?.prix || '',
    categorie: produit?.categorie || '',
    en_vedette: produit?.en_vedette || false,
  })
  // Chaque entrée: { url?: string, file?: File, preview: string }
  const [images, setImages] = useState(
    initialImages.map(url => ({ url, preview: url }))
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files || [])
    const newOnes = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...newOnes])
    e.target.value = '' // reset pour pouvoir réimporter le même fichier
  }

  function handleRemove(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function handleMove(index, direction) {
    setImages(prev => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Upload uniquement les nouveaux fichiers
      const filesToUpload = images.filter(img => img.file).map(img => img.file)
      const uploadedUrls = filesToUpload.length ? await uploadImages(filesToUpload) : []
      let uploadIndex = 0
      const finalUrls = images.map(img => img.url || uploadedUrls[uploadIndex++])

      const data = {
        ...form,
        prix: parseFloat(form.prix),
        images: finalUrls,
        image_url: finalUrls[0] || null, // compat : la 1re image reste l'image principale
      }
      if (isEdit) {
        await updateProduit(produit.id, data)
      } else {
        await createProduit(data)
      }
      router.push('/admin/produits')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nom du produit *</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Prix (€) *</label>
          <input
            name="prix"
            type="number"
            step="0.01"
            min="0"
            value={form.prix}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Catégorie</label>
          <input
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">
          Images <span className="text-gray-400 font-normal">(la 1ʳᵉ est l&apos;image principale, la 2ᵉ apparaît au hover)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-[var(--accent)]">
                  <Image src={img.preview} alt={`Image ${i + 1}`} fill sizes="200px" className="object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[var(--accent)] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                      Principale
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleMove(i, -1)}
                    disabled={i === 0}
                    className="bg-white text-black w-8 h-8 rounded-full text-sm disabled:opacity-30"
                    title="Déplacer à gauche"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="bg-red-500 text-white w-8 h-8 rounded-full text-sm"
                    title="Supprimer"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(i, 1)}
                    disabled={i === images.length - 1}
                    className="bg-white text-black w-8 h-8 rounded-full text-sm disabled:opacity-30"
                    title="Déplacer à droite"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="en_vedette"
          checked={form.en_vedette}
          onChange={handleChange}
          className="w-4 h-4 accent-[var(--accent)]"
        />
        <span className="text-sm font-medium text-gray-700">Mettre en vedette sur la page d&apos;accueil</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/produits')}
          className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
