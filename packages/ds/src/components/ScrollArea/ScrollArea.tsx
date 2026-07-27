import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { ScrollAreaProps } from './ScrollArea.types'

const rootClass = 'relative overflow-hidden'

const viewportClass =
  'h-full w-full rounded-[inherit] focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-brand'

const scrollbarClass =
  'flex touch-none select-none p-0.5 transition-colors ' +
  'data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 ' +
  'data-[orientation=horizontal]:flex-col'

const thumbClass =
  'flex-1 rounded-full bg-sand-deep transition-colors hover:bg-brand'

/**
 * Scrollable region with a themed custom scrollbar (Ark `ScrollArea`).
 * Constrain the height via `className` (e.g. `h-64`).
 *
 * @param children - Scrollable content
 *
 * @param className - Root classes, typically a height constraint
 */
export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <ArkScrollArea.Root className={mergeClasses(rootClass, className)}>
      <ArkScrollArea.Viewport className={viewportClass}>
        <ArkScrollArea.Content>{children}</ArkScrollArea.Content>
      </ArkScrollArea.Viewport>
      <ArkScrollArea.Scrollbar className={scrollbarClass}>
        <ArkScrollArea.Thumb className={thumbClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar
        orientation="horizontal"
        className={scrollbarClass}
      >
        <ArkScrollArea.Thumb className={thumbClass} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Corner />
    </ArkScrollArea.Root>
  )
}

ScrollArea.displayName = 'ScrollArea'
