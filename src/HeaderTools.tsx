import { useEffect, useRef, type MouseEvent } from 'react'
import { LANGUAGES, type Language } from './languages'

type Props = { language: Language; onLanguage: (language: Language) => void; assisted: boolean; onAssisted: () => void; onReset: () => void; embedded: boolean; text: (value: string) => string }

export default function HeaderTools({ language, onLanguage, assisted, onAssisted, onReset, embedded, text }: Props) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function dismiss(event: PointerEvent | KeyboardEvent) {
      const escape = event instanceof KeyboardEvent && event.key === 'Escape'
      if (!escape && (event instanceof KeyboardEvent || container.current?.contains(event.target as Node))) return
      container.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((details) => {
        details.open = false
        if (escape) details.querySelector('summary')?.focus()
      })
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss) }
  }, [])
  function choose(event: MouseEvent<HTMLButtonElement>, action: () => void) {
    action()
    const details = event.currentTarget.closest('details')!
    details.open = false
    details.querySelector('summary')?.focus()
  }
  return <div className="header-tools" ref={container}>
    <details className="header-menu language-picker" name="header-tools">
      <summary aria-label={text('Change language')}><span aria-hidden="true" className="language-globe">◎</span><span lang={language}>{LANGUAGES.find((item) => item.code === language)?.name}</span><span aria-hidden="true" className="menu-chevron" /></summary>
      <div className="header-menu-panel" role="group" aria-label={text('Language')}>
        {LANGUAGES.map((item) => <button key={item.code} type="button" lang={item.code} aria-pressed={language === item.code} onClick={(event) => choose(event, () => onLanguage(item.code))}><span>{item.name}</span>{language === item.code && <span aria-hidden="true">✓</span>}</button>)}
      </div>
    </details>
    <details className="header-menu secondary-menu" name="header-tools">
      <summary aria-label={text('More options')}><span aria-hidden="true">•••</span></summary>
      <div className="header-menu-panel" role="group" aria-label={text('More options')}>
        <button type="button" onClick={(event) => choose(event, onReset)}>{text('Reset Demo')}</button>
        <button type="button" aria-pressed={assisted} onClick={(event) => choose(event, onAssisted)}>{text(assisted ? 'Citizen Mode' : 'Assisted Mode')}{assisted && <span aria-hidden="true">✓</span>}</button>
        {!embedded && <a href="/frame">{text('Mobile frame')} <span aria-hidden="true">↗</span></a>}
      </div>
    </details>
  </div>
}
