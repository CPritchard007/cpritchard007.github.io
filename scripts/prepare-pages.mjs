import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const repoRoot = process.cwd()

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run `npm run build` first.')
}

// Ensures GitHub Pages doesn't run Jekyll processing.
fs.writeFileSync(path.join(distDir, '.nojekyll'), '')

// Copy company logos into dist so runtime `src/...` URLs work.
// This supports cases where images are referenced by string paths (not imported).
const companyLogosSrcDir = path.resolve(repoRoot, 'src/assets/company_logos')
const companyLogosDistDir = path.resolve(distDir, 'src/assets/company_logos')

if (fs.existsSync(companyLogosSrcDir)) {
  fs.mkdirSync(companyLogosDistDir, { recursive: true })
  fs.cpSync(companyLogosSrcDir, companyLogosDistDir, { recursive: true })
}

