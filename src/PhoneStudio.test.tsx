import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import PhoneStudio, { fitPhone } from './PhoneStudio'

describe('phone preview studio', () => {
  it('fits a complete phone within the available recording canvas', () => {
    for (const [width, height] of [[320, 600], [1280, 620], [1920, 1080]]) {
      const scale = fitPhone(width, height)
      expect(414 * scale).toBeLessThanOrEqual(width - 32)
      expect(868 * scale).toBeLessThanOrEqual(height - 32)
      expect(scale).toBeGreaterThan(0)
    }
  })
  it('embeds the real demo with a focused toolbar without frame customisation controls', () => {
    const html = renderToStaticMarkup(<PhoneStudio />)
    for (const text of ['src="/demo?embedded=1"', 'title="DBT Rescue interactive phone preview"', 'Mobile frame', 'Zoom out', 'Zoom in', 'Fit', 'Reload demo', 'Recording view', 'screen recorder']) expect(html).toContain(text)
    for (const text of ['Frame colour', 'Background', 'Natural', 'Studio']) expect(html).not.toContain(text)
  })
})
