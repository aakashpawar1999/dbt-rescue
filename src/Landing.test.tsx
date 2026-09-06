import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Landing from './Landing'
import worker from '../worker/index'

describe('public landing and separate demo', () => {
  it('explains the product and provides a real demo destination without a case intake form', () => {
    const html = renderToStaticMarkup(<Landing />)
    expect(html).toContain('A payment status should come with a next step.')
    expect(html).toContain('href="/demo"')
    expect(html).toContain('Synthetic demonstration')
    expect(html).toContain('How it works')
    expect(html).not.toContain('<form')
  })
  it.each(['/', '/demo', '/demo/', '/frame', '/frame/'])('serves the app document for direct entry %s', async (path) => {
    let requested = ''
    await worker.fetch(new Request('https://example.test' + path), { ASSETS: { fetch: async (request: Request) => { requested = new URL(request.url).pathname; return new Response('ok') } } })
    expect(requested).toBe('/')
  })
  it('serves the application document without exposing asset canonical redirects', async () => {
    const response = await worker.fetch(new Request('https://example.test/demo'), { ASSETS: { fetch: async (request: Request) => new URL(request.url).pathname === '/' ? new Response('app') : Response.redirect('https://example.test/', 307) } })
    expect(response.status).toBe(200)
  })
})
