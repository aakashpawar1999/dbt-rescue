// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { existsSync, readFileSync } from 'node:fs'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Sites deployment artifact', () => {
  it('builds the server entrypoint required by Sites', () => {
    expect(existsSync(resolve('dist/server/index.js'))).toBe(true)
  })

  it('includes demo and frame routes in the built asset worker', () => {
    const worker = readFileSync(resolve('dist/server/index.js'), 'utf8')
    expect(worker).toContain('"/demo"')
    expect(worker).toContain('"/frame"')
    expect(worker).toContain('pathname = "/"')
  })

  it('uses the Sites asset-aware Vite build', () => {
    const viteConfig = readFileSync(resolve('vite.config.ts'), 'utf8')
    expect(viteConfig).toContain('@openai/sites-vite-plugin')
    expect(viteConfig).toContain('@cloudflare/vite-plugin')
    expect(viteConfig).toMatch(/assets:\s*{\s*binding:\s*['"]ASSETS['"]/)
  })
})
