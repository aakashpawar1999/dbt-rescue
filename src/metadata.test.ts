// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { existsSync, readFileSync } from 'node:fs'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = readFileSync(resolve('index.html'), 'utf8')
const manifestPath = resolve('public/site.webmanifest')
const manifest = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : ''

function countOccurrences(value: string, pattern: string) {
  return value.match(new RegExp(pattern, 'g'))?.length ?? 0
}

describe('public identity metadata', () => {
  it('declares one complete, canonical metadata set', () => {
    expect(countOccurrences(root, '<title>')).toBe(1)
    expect(root).toContain('<meta charset="UTF-8" />')
    expect(root).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0" />')
    expect(root).toContain('name="description"')
    expect(root).toContain('name="robots"')
    expect(root).toContain('rel="canonical"')
    expect(root).toContain('name="theme-color"')
    expect(root).toContain('name="color-scheme"')
    expect(countOccurrences(root, 'property="og:')).toBe(12)
    expect(countOccurrences(root, 'name="twitter:')).toBe(5)
    expect(root).toContain('og:locale" content="en_IN"')
    expect(root).toContain('og:locale:alternate" content="hi_IN"')
    expect(root).toContain('twitter:card" content="summary_large_image"')
    expect(root).toContain('https://dbt-rescue.aakashpawar1999.chatgpt.site/')
  })

  it('references only local, shipped identity assets', () => {
    for (const asset of [
      'public/favicon.ico',
      'public/favicon-16x16.png',
      'public/favicon-32x32.png',
      'public/apple-touch-icon.png',
      'public/android-chrome-192x192.png',
      'public/android-chrome-512x512.png',
      'public/dbt-rescue-social-preview.svg',
    ]) expect(existsSync(resolve(asset))).toBe(true)

    expect(manifest).toContain('"name": "Paisa Kahan Atka? — DBT Rescue"')
    expect(manifest).toContain('"start_url": "/"')
    expect(manifest).toContain('"sizes": "192x192"')
    expect(manifest).toContain('"sizes": "512x512"')
  })
})
