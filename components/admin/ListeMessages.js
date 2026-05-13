'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { marquerCommeLu, supprimerMessage } from '@/lib/messages'

export default function ListeMessages({ messages }) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(null)

  async function handleOuvrir(msg) {
    if (ouvert === msg.id) {
      setOuvert(null)
      return
    }
    setOuvert(msg.id)
    if (!msg.lu) {
      await marquerCommeLu(msg.id)
      router.refresh()
    }
  }

  async function handleSupprimer(id, e) {
    e.stopPropagation()
    if (!confirm('Supprimer ce message ?')) return
    await supprimerMessage(id)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
      {messages.map(msg => (
        <div key={msg.id} className="hover:bg-gray-50">
          <button
            onClick={() => handleOuvrir(msg)}
            className="w-full text-left px-6 py-4 flex items-center gap-4"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.lu ? 'bg-gray-300' : 'bg-red-500'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <p className={`truncate ${msg.lu ? 'font-normal' : 'font-semibold'}`}>
                  {msg.nom} <span className="text-gray-400 font-normal">— {msg.email}</span>
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">
                {msg.sujet || msg.message}
              </p>
            </div>
          </button>

          {ouvert === msg.id && (
            <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
              {msg.sujet && (
                <p className="text-sm font-semibold mb-3">Sujet : {msg.sujet}</p>
              )}
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              <div className="flex gap-3 mt-5">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.sujet || 'Votre message')}`}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  Répondre par email
                </a>
                <button
                  onClick={(e) => handleSupprimer(msg.id, e)}
                  className="text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
