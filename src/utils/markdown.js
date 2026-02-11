import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
})

// Open external links in a new tab (still sanitized below).
const defaultLinkOpen =
  md.renderer.rules.link_open ??
  function renderLinkOpen(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.link_open = function linkOpen(tokens, idx, options, env, self) {
  const token = tokens[idx]
  const href = token.attrGet('href') ?? ''

  if (/^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noreferrer noopener')
  }

  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function renderMarkdown(source = '') {
  const dirty = md.render(String(source ?? ''))
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  })
}

