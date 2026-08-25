// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { existsSync, readFileSync } from 'node:fs'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { createHash } from 'node:crypto'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = readFileSync(resolve('index.html'), 'utf8')
const manifestPath = resolve('public/site.webmanifest')
const manifest = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : ''
const socialPreview = readFileSync(resolve('public/dbt-rescue-social-preview.svg'), 'utf8')

function countOccurrences(value: string, pattern: string) {
  return value.match(new RegExp(pattern, 'g'))?.length ?? 0
}

function sha256(asset: string) {
  return createHash('sha256').update(readFileSync(resolve(asset))).digest('hex')
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
      'public/logo.png',
      'public/dbt-rescue-social-preview.svg',
    ]) expect(existsSync(resolve(asset))).toBe(true)

    expect(sha256('public/logo.png')).toBe('f79d588a9b2d790843c9cf1cb978e85ed58dc1ed2231ca7614c9a59117943833')
    expect(sha256('public/favicon.ico')).toBe('ab8ca2f6330bcc0e4ba0db0fb6fffc1b9e34c8a4287ab855b7b3a248e1d0eff5')
    expect(sha256('public/favicon-16x16.png')).toBe('79a153103ad2d9232795b35a8ac654bf745c01fbd7c757b352b8b661d72cfd49')
    expect(sha256('public/favicon-32x32.png')).toBe('da723d045562d5769777b74b8ddc89de4cb688ef8289d125c35c7e379b31787a')
    expect(sha256('public/apple-touch-icon.png')).toBe('1efe3bb64fea1a9a7961526b22fbaa8d941e6fb6e02d358907e9d88e17172e97')
    expect(sha256('public/android-chrome-192x192.png')).toBe('95d7f3e82ac6d34273d078f43744ffc76d409ab23a84b6c0416df4e4f95d097e')
    expect(sha256('public/android-chrome-512x512.png')).toBe('97cfc35fd23efcb3b4686a12f4e6bd2be3e5aa6c19a4c665a2e37e8982a9925f')
    expect(socialPreview).toContain('viewBox="0 0 1200 630"')
    expect(socialPreview).toContain('href="/logo.png"')
    expect(socialPreview).not.toContain('stroke="#ff5a00" stroke-width="92"')

    expect(manifest).toContain('"name": "Paisa Kahan Atka? — DBT Rescue"')
    expect(manifest).toContain('"start_url": "/"')
    expect(manifest).toContain('"sizes": "192x192"')
    expect(manifest).toContain('"sizes": "512x512"')
  })
})
