import type { IconProps } from './Icon.types'

/**
 * `svg` comes from a build-time `?raw` import of a file in `assets/icons/` —
 * trusted markup, not user input, so `dangerouslySetInnerHTML` is safe here.
 */
export const Icon = ({ svg, className }: IconProps) => (
  <span
    className={className}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
)
