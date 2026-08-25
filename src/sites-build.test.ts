// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { existsSync } from 'node:fs'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Sites deployment artifact', () => {
  it('builds the server entrypoint required by Sites', () => {
    expect(existsSync(resolve('dist/server/index.js'))).toBe(true)
  })
})
