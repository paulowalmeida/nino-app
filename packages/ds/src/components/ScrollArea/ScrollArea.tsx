import type { CSSProperties } from 'react'

import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area'
import { mergeClasses } from '@ds/lib/mergeClasses'

import styles from './ScrollArea.module.css'
import { ScrollAreaProps } from './ScrollArea.types'

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
  'mx-auto w-[2px] group-hover:w-1.5',
)

const thumbHorizontalClass = mergeClasses(
  thumbBaseClass,
  'my-auto h-[2px] group-hover:h-1.5',
)

/**
 * Scrollable region with a themed custom scrollbar (Ark `ScrollArea`).
 * Constrain the height via `className` (e.g. `h-64`).
 *
 * @param children - Scrollable content
 *
 * @param className - Root classes, typically a height constraint
 *
 * @param fadeEdges - Fade out the edge the content still scrolls past
 *
 * @param style - Inline sizing when the height does not come from a class
 *
 * @param thumbColor - Scrollbar thumb colour; defaults to the brand orange
 */
export function ScrollArea({
  children,
  className,
  fadeEdges = true,
  style,
  thumbColor,
}: ScrollAreaProps) {
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
