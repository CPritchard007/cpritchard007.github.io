const WIKIPEDIA_SUMMARY_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

// Some tags are ambiguous or the Wikipedia title differs from the tag.
const TITLE_OVERRIDES = {
  Vue: 'Vue.js',
  Flutter: 'Flutter (software)',
  AngularJS: 'AngularJS',
  'C#': 'C Sharp (programming language)',
  Lua: 'Lua (programming language)',
  Python: 'Python (programming language)',
  JavaScript: 'JavaScript',
  PHP: 'PHP',
  WordPress: 'WordPress',
  MySQL: 'MySQL',
  PostgreSQL: 'PostgreSQL',
  MongoDB: 'MongoDB',
  Redis: 'Redis',
  Docker: 'Docker (software)',
  Kubernetes: 'Kubernetes',
  // Non-language/common portfolio tags you might add later:
  SCSS: 'Sass (stylesheet language)',
  GitHub: 'GitHub',
  Vite: 'Vite (software)',
}

const summaryCache = new Map()

function normalizeTag(tag) {
  return String(tag ?? '').trim()
}

export function getWikipediaTitle(tag) {
  const key = normalizeTag(tag)
  return TITLE_OVERRIDES[key] ?? key
}

function toWikiSlug(title) {
  // Wikipedia uses underscores for spaces; keep other encoding intact.
  return encodeURIComponent(String(title ?? '')).replace(/%20/g, '_')
}

export function getWikipediaPageUrl(tag) {
  const title = getWikipediaTitle(tag)
  return `https://en.wikipedia.org/wiki/${toWikiSlug(title)}`
}

export function getWikipediaSearchUrl(tag) {
  const q = normalizeTag(tag)
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`
}

/**
 * Fetch a short Wikipedia summary for a tag.
 * Returns null when unavailable (404, disambiguation, etc.).
 */
export async function getWikipediaSummary(tag) {
  const key = normalizeTag(tag)
  if (!key) return null

  if (summaryCache.has(key)) return await summaryCache.get(key)

  const title = getWikipediaTitle(key)
  const url = `${WIKIPEDIA_SUMMARY_ENDPOINT}${encodeURIComponent(title)}`

  const promise = (async () => {
    try {
      const res = await fetch(url, {
        headers: { accept: 'application/json' },
      })
      if (!res.ok) return null
      const data = await res.json()

      if (!data || data.type === 'disambiguation') return null
      if (!data.extract) return null

      const pageUrl =
        data?.content_urls?.desktop?.page ??
        data?.content_urls?.mobile?.page ??
        getWikipediaPageUrl(key)

      return {
        title: data.title ?? title,
        extract: String(data.extract),
        url: pageUrl,
      }
    } catch {
      return null
    }
  })()

  summaryCache.set(key, promise)
  return await promise
}

