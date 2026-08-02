import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area'
import { mergeClasses } from '@ds/lib/mergeClasses'

import styles from './ScrollArea.module.css'
import { ScrollAreaProps } from './ScrollArea.types'

/** How much of the edge dissolves while the axis can still scroll. */
const FADE = '2rem'

const rootClass = 'group relative overflow-hidden'

/* A barra nativa precisa sumir explicitamente: o Ark desenha a dele por cima
 * do mesmo viewport, e sem isto as duas aparecem lado a lado. */
const viewportClass =
  'h-full w-full rounded-[inherit] [scrollbar-width:none] ' +
  '[&::-webkit-scrollbar]:hidden focus-visible:outline-2 ' +
  'focus-visible:outline-brand focus-visible:-outline-offset-2'

/* A barra é uma marca de tinta na borda do conteúdo, não um trilho desenhado.
 * A área de clique é constante (nada de layout shift ao passar o ponteiro);
 * quem muda é a tinta dentro dela. Cada eixo some quando não há o que rolar
 * nele (`data-overflow-x/y`), senão sobra um traço solto no rodapé de toda
 * lista vertical. */
const scrollbarClass =
  'flex touch-none select-none p-[3px] ' +
  'data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3 ' +
  'data-[orientation=horizontal]:flex-col'

/* O gesto do componente: em repouso o polegar é um fio de 2px rente à borda;
 * com o ponteiro na região ele engrossa e ganha densidade, e sob arraste abre
 * um halo da própria cor. Toda a variação sai de `--ds-scroll-thumb` via
 * color-mix e opacidade — uma só decisão de cor por barra, como antes. */
const thumbBaseClass =
  'rounded-full bg-[color:var(--ds-scroll-thumb)] opacity-40 ' +
  'transition-[width,height,opacity,box-shadow] duration-300 ' +
  'ease-[cubic-bezier(0.2,0.9,0.25,1)] motion-reduce:transition-none ' +
  'group-hover:opacity-80 ' +
  'active:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ds-scroll-thumb)_20%,transparent)]'

const thumbVerticalClass = mergeClasses(
  thumbBaseClass,
  'mx-auto w-[2px] group-hover:w-1.5'
)

const thumbHorizontalClass = mergeClasses(
  thumbBaseClass,
  'my-auto h-[2px] group-hover:h-1.5'
)

/**
 * Scrollable region with a themed custom scrollbar (Ark `ScrollArea`).
 * Constrain the height via `className` (e.g. `h-64`).
 *
 * @param children - Scrollable content
 *
 * @param className - Root classes, typically a height constraint
 *
 * @param fadeEdges - Fade any edge the content can still scroll past
 *
 * @param style - Inline sizing when the height does not come from a class
 *
 * @param thumbColor - Scrollbar thumb colour; defaults to the brand orange
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
      className={mergeClasses(rootClass, className)}
      style={thumbStyle}
    >
      <ArkScrollArea.Viewport
        ref={viewportRef}
        onScroll={fadeEdges ? paintEdges : undefined}
        className={mergeClasses(viewportClass, fadeEdges && styles.fade)}
      >
        <ArkScrollArea.Content>{children}</ArkScrollArea.Content>
      </ArkScrollArea.Viewport>
      <ArkScrollArea.Scrollbar
        className={mergeClasses(scrollbarClass, 'not-data-[overflow-y]:hidden')}
      >
        <ArkScrollArea.Thumb className={thumbVerticalClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar
        orientation="horizontal"
        className={mergeClasses(scrollbarClass, 'not-data-[overflow-x]:hidden')}
      >
        <ArkScrollArea.Thumb className={thumbHorizontalClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Corner />
    </ArkScrollArea.Root>
  )
}

ScrollArea.displayName = 'ScrollArea'
