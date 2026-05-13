'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CarteProduct({ produit, priority = false, index = 0 }) {
  const images = produit.images?.length ? produit.images : (produit.image_url ? [produit.image_url] : [])
  const imagePrincipale = images[0]
  const imageHover = images[1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/produits/${produit.id}`} className="group block">
        <div className="relative aspect-[4/5] bg-[var(--gris-clair)] rounded-3xl overflow-hidden">
          {imagePrincipale ? (
            <>
              <Image
                src={imagePrincipale}
                alt={produit.nom}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
                className={`object-cover transition-all duration-[1.2s] ease-out ${
                  imageHover ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-110'
                }`}
              />
              {imageHover && (
                <Image
                  src={imageHover}
                  alt={`${produit.nom} - vue alternative`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[1.2s] ease-out scale-105"
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <span className="text-xs uppercase tracking-widest">Aucune image</span>
            </div>
          )}

          {/* Badge en vedette */}
          {produit.en_vedette && (
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-[10px] uppercase tracking-widest font-medium">Coup de cœur</span>
            </div>
          )}

          {/* Overlay au hover */}
          <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <div className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">→</span>
            </div>
          </div>
        </div>

        <div className="mt-5 px-1">
          {produit.categorie && (
            <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-1">
              {produit.categorie}
            </p>
          )}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-medium text-lg text-black group-hover:text-[var(--gold-dark)] transition-colors">
              {produit.nom}
            </h3>
            <p className="font-medium text-lg whitespace-nowrap">
              {Number(produit.prix).toFixed(0)} €
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
