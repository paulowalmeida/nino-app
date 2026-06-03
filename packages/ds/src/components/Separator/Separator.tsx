import { mergeClasses } from '@ds/lib/mergeClasses'

import { SeparatorOrientation, SeparatorProps } from './Separator.types'

const orientationClasses: Record<SeparatorOrientation, string> = {
  horizontal: 'w-full h-px',
  vertical:   'h-full w-px',
}

const baseSeparator = 'shrink-0 bg-gray-200'

/**
 * Divider line to separate content sections.
 *
 * @param orientation - Separator direction. Default: `horizontal`
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Separator />
 * <Separator orientation="vertical" className="h-6" />
 */
export function Separator({
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={mergeClasses(
        baseSeparator,
        orientationClasses[orientation],
        className
      )}
      {...props}
    />
  )
}
