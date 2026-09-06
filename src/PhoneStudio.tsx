import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './phone-studio.css'

export function fitPhone(width: number, height: number) {
  return Math.max(.05, Math.min(1, (width - 32) / 414, (height - 32) / 868))
}

export default function PhoneStudio() {
  const [finish, setFinish] = useState('natural')
  const [background, setBackground] = useState('studio')
  const [zoom, setZoom] = useState(1)
  const [fit, setFit] = useState(.7)
  const [recording, setRecording] = useState(false)
  const [reload, setReload] = useState(0)
  const stage = useRef<HTMLElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const recordButton = useRef<HTMLButtonElement>(null)
  const scale = fit * zoom

  function exitRecording() {
    setRecording(false)
    requestAnimationFrame(() => recordButton.current?.focus())
  }
  function escape(event: KeyboardEvent) {
    if (event.key === 'Escape' && recordButton.current?.closest('header')?.hidden) exitRecording()
  }

  useEffect(() => {
    const element = stage.current!
    const observer = new ResizeObserver(() => setFit(fitPhone(element.clientWidth, element.clientHeight)))
    observer.observe(element)
    window.addEventListener('keydown', escape)
    return () => { observer.disconnect(); window.removeEventListener('keydown', escape) }
  }, [])

  return <div className={`phone-studio backdrop-${background}${recording ? ' recording-view' : ''}`}>
    <header className="studio-toolbar" hidden={recording}>
      <a href="/demo" className="studio-back">← Back to demo</a>
      <strong className="studio-title">DBT Rescue <span>Phone studio</span></strong>
      <label>Frame colour<select value={finish} onChange={(event) => setFinish(event.target.value)}>
        <option value="natural">Natural</option><option value="black">Black</option><option value="desert">Desert</option><option value="white">White</option>
      </select></label>
      <label>Background<select value={background} onChange={(event) => setBackground(event.target.value)}>
        <option value="studio">Studio</option><option value="clean">Clean</option><option value="mint">Mint</option><option value="chroma">Chroma</option>
      </select></label>
      <div className="studio-zoom" role="group" aria-label="Preview zoom">
        <button aria-label="Zoom out" disabled={zoom <= .5} onClick={() => setZoom((value) => Math.max(.5, value - .1))}>−</button>
        <output aria-label="Preview scale">{Math.round(scale * 100)}%</output>
        <button aria-label="Zoom in" disabled={zoom >= 1.5} onClick={() => setZoom((value) => Math.min(1.5, value + .1))}>+</button>
        <button onClick={() => setZoom(1)}>Fit</button>
      </div>
      <button onClick={() => setReload((value) => value + 1)}>Reload demo</button>
      <button className="record-view-button" ref={recordButton} onClick={() => setRecording(true)}>Recording view</button>
    </header>
    {recording && <button className="exit-recording" onClick={exitRecording}>Exit recording view <kbd>Esc</kbd></button>}
    <main className="studio-stage" ref={stage} aria-label="Interactive iPhone-style preview">
      <div className="phone-space" style={{ width: 414 * scale, height: 868 * scale }}>
        <div className={`studio-phone finish-${finish}`} style={{ '--phone-scale': scale } as CSSProperties}>
          <span className="phone-side-button phone-mute" aria-hidden="true" /><span className="phone-side-button phone-volume" aria-hidden="true" /><span className="phone-side-button phone-power" aria-hidden="true" />
          <div className="phone-screen">
            <div className="phone-status" aria-hidden="true"><span>9:41</span><span className="phone-island" /><span className="phone-indicators">▮▮▮ <span>⌁</span> ▰</span></div>
            <iframe key={reload} ref={iframe} src="/demo?embedded=1" title="DBT Rescue interactive phone preview" onLoad={() => iframe.current?.contentWindow?.addEventListener('keydown', escape)} />
            <div className="phone-home" aria-hidden="true"><span /></div>
          </div>
        </div>
      </div>
    </main>
    <footer className="studio-hint" hidden={recording}>Interactive demo · Use your screen recorder to capture video. Recording view hides the controls; press Esc or use the top-right exit.</footer>
  </div>
}
