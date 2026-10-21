import { HTMLAttributes, ReactNode } from 'react'

import { MarginProps } from '@ds/lib/spacing/spacing'

import { Box } from '../Box/Box'
import { Heading } from '../Heading/Heading'
import { HeadingLevel, HeadingSize } from '../Heading/Heading.types'
import { Text } from '../Text/Text'

type HeaderProps = HTMLAttributes<HTMLElement> &
  MarginProps & {
    /** Screen title */
    title: string
    /**
     * Heading rank of the title. Default: `1` — the screen header is the
     * screen's own title. Drop it when the header sits inside a page that
     * already has an `h1`
     */
    level?: HeadingLevel
    /** Visual size of the title. Defaults to the size that matches `level` */
    size?: HeadingSize
    /**
     * Kept so existing screens keep compiling. The peach underline now
     * covers the whole title, so the value is no longer read
     */
    accent?: string
    /**
     * Where title and description sit. `center` is for screens that stand
     * alone on the page, like sign-in. Default: `left`
     */
    align?: 'left' | 'center'
    /** `id` of the title element, for an `aria-labelledby` that names a region by it */
    titleId?: string
    /** Supporting line under the title */
    description?: string
    /** Right-aligned actions (buttons, menus) */
    actions?: ReactNode
  }

/**
 * Screen header: title, optional supporting line, and a slot for actions.
 * A shortcut for the shape most screens repeat — a screen that needs
 * something else (filters, tabs, search inside the header) composes its own
 * from `Heading` and `Text` instead of growing this one.
 *
 * ```tsx
 * <Header title="Quem toca a equipe" accent="equipe" />
 * <Header title="Pedidos" description="Um toque move o pedido adiante." />
 *
 * - `align` — `left` (default) or `center`
 * - `accent` — Kept for compatibility; the whole title gets the peach underline
 * - `m` — Margin on every side, from the Tailwind spacing scale. `mt`, `mb`, `mx` and `my` narrow it to one axis or side
 * - `className` — Additional CSS classes
 * ```
 */
export function Header({
  title,
  level = 1,
  size,
  accent: _accent,
  align = 'left',
  titleId,
  description,
  actions,
  m,
  mt,
  mb,
  mx,
  my,
  className,
  ...props
}: HeaderProps) {
  return (
    <Box
      direction={{ mobile: 'column', tablet: 'row' }}
      align={{ mobile: 'stretch', tablet: 'start' }}
      justify={align === 'center' ? 'center' : 'between'}
      gap={4}
      m={m}
      mt={mt}
      mb={mb}
      mx={mx}
      my={my}
      className={className}
      {...props}
    >
      <Box gap={1} align={align === 'center' ? 'center' : undefined}>
        <Heading level={level} size={size} align={align} id={titleId} accent>
          {title}
        </Heading>
        {description && (
          <Text size="sm" color="subtle" align={align}>
            {description}
          </Text>
        )}
      </Box>
      {actions && (
        <Box
          direction={{ mobile: 'column', tablet: 'row' }}
          align={{ mobile: 'stretch', tablet: 'center' }}
          gap={2}
          shrink={false}
        >
          {actions}
        </Box>
      )}
    </Box>
  )
}
