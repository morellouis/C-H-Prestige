'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function GalerieProduit({ images, nom }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  if (!images?.length) {
    return (
      <div className="relative aspect-square bg-[var(--gris-clair)] rounded-3xl flex items-center justify-center text-gray-400">
        Aucune image
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Image principale */}
        <motion.button
          type="button"
          onClick={() => setZoom(true)}
          className="relative aspect-square bg-[var(--gris-clair)] rounded-3xl overflow-hidden cursor-zoom-in group"
          whileHover={{ scale: 1.005 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={nom}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">⛶</span>
          </div>
        </motion.button>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-[var(--gris-clair)] border-2 transition-all duration-300 ${
                  i === active
                    ? 'border-[var(--gold)] scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={url}
                  alt={`${nom} ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal zoom */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full max-w-6xl"
            >
              <Image
                src={images[active]}
                alt={nom}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <button
              onClick={() => setZoom(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl"
              aria-label="Fermer"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
