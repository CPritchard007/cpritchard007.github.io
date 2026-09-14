const DEFAULT_ICON_BACKGROUND = '#e8eaed'
const metadataCache = new Map()

function parseTagAttributes(tag) {
  const attrs = {}

  for (const match of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*["']([^"']*)["']/g)) {
    attrs[match[1].toLowerCase()] = match[2]
  }

  return attrs
}

function iconSize(sizes) {
  const values = String(sizes ?? '')
    .split(/\s+/)
    .map((value) => {
      const match = value.match(/(\d+)/)
      return match ? Number(match[1]) : 0
    })

  return Math.max(0, ...values)
}

function scoreIcon({ rel, sizes, type }) {
  const normalizedRel = String(rel ?? '').toLowerCase()
  const normalizedType = String(type ?? '').toLowerCase()
  let score = iconSize(sizes)

  if (normalizedRel.includes('apple-touch-icon')) score += 1000
  if (normalizedType.includes('png')) score += 80
  if (normalizedType.includes('svg')) score += 60
  if (normalizedType.includes('icon')) score += 20
  if (normalizedRel === 'icon' || normalizedRel === 'shortcut icon') score += 10

  return score
}

export function extractSiteMetadata(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? []
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? []
  const icons = []
  let themeColor = ''

  for (const tag of metaTags) {
    const attrs = parseTagAttributes(tag)
    const name = String(attrs.name ?? '').toLowerCase()

    if (name === 'theme-color' && attrs.content && !themeColor) {
      themeColor = attrs.content.trim()
    }

    if (name === 'msapplication-tilecolor' && attrs.content && !themeColor) {
      themeColor = attrs.content.trim()
    }
  }

  for (const tag of linkTags) {
    const attrs = parseTagAttributes(tag)
    const rel = String(attrs.rel ?? '').toLowerCase()
    const href = attrs.href?.trim()

    if (!href) continue
    if (!rel.includes('apple-touch-icon') && rel !== 'icon' && rel !== 'shortcut icon') continue

    icons.push({
      href,
      rel,
      type: attrs.type ?? '',
      sizes: attrs.sizes ?? '',
      score: scoreIcon(attrs),
      isAppIcon: rel.includes('apple-touch-icon'),
    })
  }

  icons.sort((left, right) => right.score - left.score)

  return {
    icon: icons[0]?.href ?? '',
    icons: icons.map((icon) => icon.href),
    themeColor,
    isAppIcon: Boolean(icons[0]?.isAppIcon),
  }
}

export function resolveSiteUrl(asset, baseUrl) {
  if (!asset) return ''

  const normalized = String(asset).replaceAll('%BASE_URL%', '').trim()
  if (!normalized) return ''
  if (/^https?:\/\//i.test(normalized) || normalized.startsWith('data:')) return normalized
  if (!baseUrl) return ''

  try {
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    return new URL(normalized, base).href
  } catch {
    return ''
  }
}

function githubFullNameFromPagesUrl(url) {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('.github.io')) return ''

    const owner = parsed.hostname.split('.')[0]
    const repo = parsed.pathname.split('/').filter(Boolean)[0] ?? `${owner}.github.io`
    return `${owner}/${repo}`
  } catch {
    return ''
  }
}

function githubAvatarFromUrl(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return ''

    const [user] = parsed.pathname.split('/').filter(Boolean)
    if (!user) return ''

    return `https://github.com/${user}.png?size=128`
  } catch {
    return ''
  }
}

function googleFaviconFromUrl(url) {
  try {
    const hostname = new URL(url).hostname
    if (!hostname) return ''
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
  } catch {
    return ''
  }
}

function inferFallbackIcon(url) {
  return githubAvatarFromUrl(url) || googleFaviconFromUrl(url)
}

async function fetchGithubHtml(fullName, path, ref) {
  const params = ref ? `?ref=${encodeURIComponent(ref)}` : ''
  const response = await fetch(
    `https://api.github.com/repos/${fullName}/contents/${path}${params}`,
    {
      headers: {
        Accept: 'application/vnd.github.raw+json',
      },
    },
  )

  if (!response.ok) return ''
  return await response.text()
}

async function fetchGithubPagesHtml(fullName) {
  const attempts = [
    ['index.html', 'gh-pages'],
    ['docs/index.html', 'gh-pages'],
    ['index.html', ''],
    ['docs/index.html', ''],
  ]

  for (const [path, ref] of attempts) {
    try {
      const html = await fetchGithubHtml(fullName, path, ref)
      if (html) return html
    } catch (error) {
      console.error(`Failed to read site metadata for ${fullName} (${ref || 'default'}/${path}).`, error)
    }
  }

  return ''
}

function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))]
}

export function getDefaultIconBackground() {
  return DEFAULT_ICON_BACKGROUND
}

export async function fetchSiteMetadata(targetUrl, { githubFullName } = {}) {
  const cacheKey = `${githubFullName || ''}::${targetUrl || ''}`
  if (metadataCache.has(cacheKey)) return await metadataCache.get(cacheKey)

  const promise = (async () => {
    const fallbackIcon = targetUrl ? inferFallbackIcon(targetUrl) : ''
    const fullName = githubFullName || (targetUrl ? githubFullNameFromPagesUrl(targetUrl) : '')
    const html = fullName ? await fetchGithubPagesHtml(fullName) : ''
    const meta = html ? extractSiteMetadata(html) : { icon: '', icons: [], themeColor: '', isAppIcon: false }
    const resolvedIcons = uniqueUrls([
      ...[meta.icon, ...meta.icons].map((href) => resolveSiteUrl(href, targetUrl)),
      fallbackIcon,
    ])
    const usedFallbackOnly = !meta.icon && Boolean(fallbackIcon)

    return {
      icon: resolvedIcons[0] || '',
      icons: resolvedIcons,
      themeColor: meta.themeColor || '',
      isAppIcon: meta.isAppIcon || (usedFallbackOnly && Boolean(githubAvatarFromUrl(targetUrl))),
    }
  })()

  metadataCache.set(cacheKey, promise)
  return await promise
}
