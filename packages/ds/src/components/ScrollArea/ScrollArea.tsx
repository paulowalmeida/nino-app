import { CSSProperties, ReactNode, useCallback, useEffect, useRef } from 'react'

import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './ScrollArea.module.css'

type ScrollAreaProps = {
  /** Scrollable content */
  children: ReactNode
  /** Classes for the root — typically a height/max-height constraint */
  className?: string
  /**
   * Fades the content against any edge it can still scroll past. Opt-in: the
   * mask is a paint effect over the whole viewport, so it is off by default
   * and each caller decides. Defaults to `false`.
   */
  fadeEdges?: boolean
  /** Inline sizing, for heights that do not come from a utility class */
  style?: CSSProperties
  /**
   * Scrollbar thumb colour. Defaults to the brand orange; takes any CSS
   * colour, so a tenant with its own palette can pass a hex (`#0f766e`) or a
   * token (`var(--color-fg-strong)`).
   */
  thumbColor?: string
}

/** Quanto da borda se dissolve enquanto o eixo ainda pode rolar. */
const FADE = '2rem'

/**
 * Scrollable region with a themed custom scrollbar (Ark `ScrollArea`).
 * Constrain the height via `className` (e.g. `h-64`).
 *
 * - `children` — Scrollable content
 * - `className` — Root classes, typically a height constraint
 * - `fadeEdges` — Fade any edge the content can still scroll past
 * - `style` — Inline sizing when the height does not come from a class
 * - `thumbColor` — Scrollbar thumb colour; defaults to the brand orange
 */
export function ScrollArea({
  children,
  className,
  fadeEdges = false,
  style,
  thumbColor,
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null)

  /* Uma variável por borda, escrita direto no elemento: a máscara do CSS só
   * lê. Sem estado em React — isto roda a cada frame de rolagem. */
  const paintEdges = useCallback(() => {
    const el = viewportRef.current
    if (!el) return

    const { scrollTop, scrollLeft } = el
    const bottom = el.scrollHeight - el.clientHeight - scrollTop
    const right = el.scrollWidth - el.clientWidth - scrollLeft

    el.style.setProperty('--ds-fade-t', scrollTop > 1 ? FADE : '0px')
    el.style.setProperty('--ds-fade-b', bottom > 1 ? FADE : '0px')
    el.style.setProperty('--ds-fade-l', scrollLeft > 1 ? FADE : '0px')
    el.style.setProperty('--ds-fade-r', right > 1 ? FADE : '0px')
  }, [])

  /* O conteúdo cresce e encolhe sem ninguém rolar (item novo na lista, coluna
   * que recolhe): sem observar o tamanho, a borda ficaria esmaecida no fim de
   * uma lista que já cabe inteira. */
  useEffect(() => {
    const el = viewportRef.current
    if (!fadeEdges || !el) return

    paintEdges()

    const observer = new ResizeObserver(paintEdges)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)

    return () => observer.disconnect()
  }, [fadeEdges, paintEdges])

  const thumbStyle = {
    '--ds-scroll-thumb': thumbColor ?? 'var(--color-brand)',
    ...style,
  } as CSSProperties

  return (
    <ArkScrollArea.Root
      className={mergeClasses(styles.scrollArea, className)}
      style={thumbStyle}
    >
      <ArkScrollArea.Viewport
        ref={viewportRef}
        onScroll={fadeEdges ? paintEdges : undefined}
        className={mergeClasses(
          styles.viewport,
          fadeEdges && styles.edgeFadeMask
        )}
      >
        <ArkScrollArea.Content>{children}</ArkScrollArea.Content>
      </ArkScrollArea.Viewport>
      <ArkScrollArea.Scrollbar
        className={mergeClasses(styles.scrollbar, styles.scrollbarVertical)}
      >
        <ArkScrollArea.Thumb
          className={mergeClasses(styles.thumb, styles.thumbVertical)}
        />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar
        orientation="horizontal"
        className={mergeClasses(styles.scrollbar, styles.scrollbarHorizontal)}
      >
        <ArkScrollArea.Thumb
          className={mergeClasses(styles.thumb, styles.thumbHorizontal)}
        />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Corner />
    </ArkScrollArea.Root>
  )
}
