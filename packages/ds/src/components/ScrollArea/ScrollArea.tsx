import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { ScrollAreaProps } from './ScrollArea.types'

const rootClass = 'group relative overflow-hidden'

/* A barra nativa precisa sumir explicitamente: o Ark desenha a dele por cima
 * do mesmo viewport, e sem isto as duas aparecem lado a lado. */
const viewportClass =
  'h-full w-full rounded-[inherit] [scrollbar-width:none] ' +
  '[&::-webkit-scrollbar]:hidden focus-visible:outline-2 ' +
  'focus-visible:outline-brand focus-visible:-outline-offset-2'

/* A barra é uma marca de tinta na borda do conteúdo, não um trilho desenhado:
 * fica fraca enquanto ninguém a procura e escurece quando o ponteiro entra na
 * região. Sem trilho de fundo — o que orienta é a posição do polegar. Cada
 * eixo some quando não há o que rolar nele (`data-overflow-x/y`), senão sobra
 * um traço solto no rodapé de toda lista vertical. */
const scrollbarClass =
  'flex touch-none select-none p-[3px] opacity-60 ' +
  'transition-opacity duration-200 group-hover:opacity-100 ' +
  'data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 ' +
  'data-[orientation=horizontal]:flex-col'

const thumbClass =
  'flex-1 rounded-full bg-ink/20 transition-colors duration-200 ' +
  'hover:bg-ink/40 group-hover:bg-ink/30'

/**
 * Scrollable region with a themed custom scrollbar (Ark `ScrollArea`).
 * Constrain the height via `className` (e.g. `h-64`).
 *
 * @param children - Scrollable content
 *
 * @param className - Root classes, typically a height constraint
 *
 * @param style - Inline sizing when the height does not come from a class
 */
export function ScrollArea({ children, className, style }: ScrollAreaProps) {
  return (
    <ArkScrollArea.Root
      className={mergeClasses(rootClass, className)}
      style={style}
    >
      <ArkScrollArea.Viewport className={viewportClass}>
        <ArkScrollArea.Content>{children}</ArkScrollArea.Content>
      </ArkScrollArea.Viewport>
      <ArkScrollArea.Scrollbar
        className={mergeClasses(scrollbarClass, 'not-data-[overflow-y]:hidden')}
      >
        <ArkScrollArea.Thumb className={thumbClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar
        orientation="horizontal"
        className={mergeClasses(scrollbarClass, 'not-data-[overflow-x]:hidden')}
      >
        <ArkScrollArea.Thumb className={thumbClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Corner />
    </ArkScrollArea.Root>
  )
}

ScrollArea.displayName = 'ScrollArea'
