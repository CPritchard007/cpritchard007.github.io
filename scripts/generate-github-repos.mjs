import fs from 'node:fs'
import path from 'node:path'
import { extractSiteMetadata, resolveSiteUrl } from '../src/utils/siteMetadata.js'

const DEFAULT_USERNAME = 'cpritchard007'
const DEFAULT_TOPIC = 'project'
const DEFAULT_OUT = path.resolve(process.cwd(), 'public/data/github-repos.json')

function parseArgs(argv) {
  const options = {
    out: DEFAULT_OUT,
    username: process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || DEFAULT_USERNAME,
    topic: (process.env.GITHUB_PROJECT_TOPIC || process.env.VITE_GITHUB_PROJECT_TOPIC || DEFAULT_TOPIC).toLowerCase(),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--out' && argv[i + 1]) {
      options.out = path.resolve(process.cwd(), argv[++i])
      continue
    }

    if (arg === '--username' && argv[i + 1]) {
      options.username = argv[++i]
      continue
    }

    if (arg === '--topic' && argv[i + 1]) {
      options.topic = argv[++i].toLowerCase()
    }
  }

  return options
}

function githubHeaders(extra = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-github-repos-sync',
    ...extra,
  }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function githubFetch(url, extraHeaders = {}) {
  const response = await fetch(url, {
    headers: githubHeaders(extraHeaders),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`GitHub API ${response.status} for ${url}${body ? `: ${body.slice(0, 200)}` : ''}`)
  }

  return response
}

function isPublicOwnedRepo(repo) {
  // /users/{username}/repos only returns public repos, but keep an explicit
  // guard so authenticated tokens can never leak private creations.
  return Boolean(repo) && repo.private !== true && repo.visibility !== 'private' && repo.fork !== true
}

async function fetchAllPublicRepos(username) {
  const repos = []
  let page = 1

  while (true) {
    // Public user listing endpoint — never /user/repos (that can include private).
    const response = await githubFetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&type=owner&page=${page}`,
    )
    const batch = await response.json()

    if (!Array.isArray(batch) || batch.length === 0) break

    repos.push(...batch.filter(isPublicOwnedRepo))
    if (batch.length < 100) break
    page += 1
  }

  return repos
}

async function fetchTopics(fullName, fallback = []) {
  if (Array.isArray(fallback) && fallback.length > 0) return fallback

  const response = await githubFetch(`https://api.github.com/repos/${fullName}/topics`)
  const data = await response.json()
  return data.names ?? []
}

function getGithubPagesUrl(repo, username) {
  if (!repo.has_pages) return ''

  const homepage = repo.homepage?.trim() || ''
  if (homepage) return homepage

  const owner = repo.owner?.login ?? username
  const normalizedRepoName = repo.name.toLowerCase()
  const userPagesRepoName = `${owner.toLowerCase()}.github.io`

  if (normalizedRepoName === userPagesRepoName) {
    return `https://${owner}.github.io/`
  }

  return `https://${owner}.github.io/${repo.name}/`
}

async function fetchGithubHtml(fullName, filePath, ref) {
  const params = ref ? `?ref=${encodeURIComponent(ref)}` : ''
  const response = await fetch(
    `https://api.github.com/repos/${fullName}/contents/${filePath}${params}`,
    {
      headers: githubHeaders({
        Accept: 'application/vnd.github.raw+json',
      }),
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

  for (const [filePath, ref] of attempts) {
    try {
      const html = await fetchGithubHtml(fullName, filePath, ref)
      if (html) return html
    } catch (error) {
      console.warn(`Failed to read site metadata for ${fullName} (${ref || 'default'}/${filePath}).`, error)
    }
  }

  return ''
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

function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))]
}

async function buildSiteMetadata(siteUrl, fullName) {
  if (!siteUrl) {
    return { icon: '', icons: [], themeColor: '', isAppIcon: false }
  }

  const fallbackIcon = githubAvatarFromUrl(siteUrl) || googleFaviconFromUrl(siteUrl)
  const html = await fetchGithubPagesHtml(fullName)
  const meta = html
    ? extractSiteMetadata(html)
    : { icon: '', icons: [], themeColor: '', isAppIcon: false }
  const resolvedIcons = uniqueUrls([
    ...[meta.icon, ...meta.icons].map((href) => resolveSiteUrl(href, siteUrl)),
    fallbackIcon,
  ])
  const usedFallbackOnly = !meta.icon && Boolean(fallbackIcon)

  return {
    icon: resolvedIcons[0] || '',
    icons: resolvedIcons,
    themeColor: meta.themeColor || '',
    isAppIcon: meta.isAppIcon || (usedFallbackOnly && Boolean(githubAvatarFromUrl(siteUrl))),
  }
}

async function buildRepoRecord(repo, topics, username) {
  const pagesUrl = getGithubPagesUrl(repo, username)
  const siteUrl = pagesUrl || repo.homepage?.trim() || ''
  const siteMeta = await buildSiteMetadata(siteUrl, repo.full_name)

  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description?.trim() || 'No description added yet.',
    homepage: repo.homepage?.trim() || '',
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    archived: repo.archived,
    hasPages: repo.has_pages,
    pagesUrl,
    pagesImage: '',
    topics,
    siteUrl,
    siteIcon: siteMeta.icon,
    siteIcons: siteMeta.icons,
    siteColor: siteMeta.themeColor,
    siteIconPadded: !siteMeta.isAppIcon,
  }
}

async function main() {
  const { out, username, topic } = parseArgs(process.argv.slice(2))

  console.log(`Fetching public repos for ${username} (topic: ${topic})...`)

  const candidates = await fetchAllPublicRepos(username)

  const withTopics = []
  for (const repo of candidates) {
    if (!isPublicOwnedRepo(repo)) continue

    const topics = await fetchTopics(repo.full_name, repo.topics)
    if (!topics.some((name) => String(name).toLowerCase() === topic)) continue
    withTopics.push({ repo, topics })
  }

  const records = []
  for (const { repo, topics } of withTopics) {
    records.push(await buildRepoRecord(repo, topics, username))
  }

  records.sort((left, right) => {
    if (left.hasPages !== right.hasPages) {
      return left.hasPages ? -1 : 1
    }

    return new Date(right.createdAt) - new Date(left.createdAt)
  })

  const payload = {
    generatedAt: new Date().toISOString(),
    username,
    topic,
    visibility: 'public',
    repos: records,
  }

  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`)

  console.log(`Wrote ${records.length} public repos to ${out}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
