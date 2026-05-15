#!/usr/bin/env node
/**
 * Génère favicon.ico + icon.png + apple-icon.png + opengraph-image.png
 * à partir du logo source.
 *
 * Usage : npm run icons -- ~/Downloads/logo.png
 */
import { execSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDir = join(__dirname, '..', 'app')
const publicDir = join(__dirname, '..', 'public')

const source = process.argv[2] || join(process.env.HOME, 'Downloads', 'logo.png')
const sourcePath = resolve(source.replace(/^~/, process.env.HOME))

if (!existsSync(sourcePath)) {
  console.error(`Logo source introuvable : ${sourcePath}`)
  process.exit(1)
}

const tmpSquare = '/tmp/logo-square.png'
const tmp256 = '/tmp/logo-256.png'

console.log('→ Source :', sourcePath)

// 1. Récupère la hauteur du logo pour faire un crop carré centré
const sizeOutput = execSync(`sips -g pixelWidth -g pixelHeight "${sourcePath}"`).toString()
const height = Number(sizeOutput.match(/pixelHeight: (\d+)/)[1])
console.log(`→ Recadrage en carré ${height}x${height}...`)
execSync(`sips -c ${height} ${height} "${sourcePath}" --out ${tmpSquare}`, { stdio: 'ignore' })

// 2. icon.png 512×512
console.log('→ icon.png (512×512)')
execSync(`sips -z 512 512 ${tmpSquare} --out "${join(appDir, 'icon.png')}"`, { stdio: 'ignore' })

// 3. apple-icon.png 180×180
console.log('→ apple-icon.png (180×180)')
execSync(`sips -z 180 180 ${tmpSquare} --out "${join(appDir, 'apple-icon.png')}"`, { stdio: 'ignore' })

// 4. favicon.ico depuis un 256×256
execSync(`sips -z 256 256 ${tmpSquare} --out ${tmp256}`, { stdio: 'ignore' })
const ico = await pngToIco(tmp256)
writeFileSync(join(appDir, 'favicon.ico'), ico)
console.log(`→ favicon.ico (${ico.length} bytes)`)

// 5. opengraph-image.png — image complète, pas recadrée
execSync(`cp "${sourcePath}" "${join(appDir, 'opengraph-image.png')}"`, { stdio: 'ignore' })
console.log('→ opengraph-image.png (image originale)')

// 6. logo-blanc-transparent.png : version blanche sur fond transparent (fonds sombres)
console.log('→ logo-blanc-transparent.png (pour footer et admin)')
const masque = await sharp(tmpSquare)
  .removeAlpha()
  .greyscale()
  .negate()
  .png()
  .toBuffer()
const { width: w, height: h } = await sharp(masque).metadata()
const fondBlanc = await sharp({
  create: { width: w, height: h, channels: 3, background: '#ffffff' },
}).png().toBuffer()
await sharp(fondBlanc)
  .joinChannel(masque)
  .png()
  .toFile(join(publicDir, 'logo-blanc-transparent.png'))

// 7. logo-noir-transparent.png : version noire sur fond transparent (fonds clairs)
console.log('→ logo-noir-transparent.png (pour navbar publique)')
const fondNoir = await sharp({
  create: { width: w, height: h, channels: 3, background: '#000000' },
}).png().toBuffer()
await sharp(fondNoir)
  .joinChannel(masque)
  .png()
  .toFile(join(publicDir, 'logo-noir-transparent.png'))

console.log('\nTerminé. Pense à git add + commit + push.')
