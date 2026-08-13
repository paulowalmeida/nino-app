import { HTMLAttributes, ReactNode } from 'react'

import { MarginProps } from '@ds/lib/spacing/spacing'

import { Flexbox } from '../Flexbox/Flexbox'
import { Heading } from '../Heading/Heading'
import { HeadingLevel, HeadingSize } from '../Heading/Heading.types'
import { Text } from '../Text/Text'
import styles from './Header.module.css'

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
     * Word or phrase inside `title` that gets the peach underline. Must
     * appear in `title` verbatim; ignored otherwise.
     */
    accent?: string
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
 * - `accent` — Word inside `title` that gets the peach underline
 * - `m` — Margin on every side, from the Tailwind spacing scale. `mt`, `mb`, `mx` and `my` narrow it to one axis or side
 * - `className` — Additional CSS classes
 * ```
 */
export function Header({
  title,
  level = 1,
  size,
  accent,
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
  /* Corta o título na posição real do destaque em vez de removê-lo e
   * reescrevê-lo no fim: assim uma palavra destacada no meio da frase
   * continua no lugar em que foi escrita. */
  const accentAt = accent ? title.indexOf(accent) : -1

  return (
    <Flexbox
      direction="row"
      align="start"
      justify="between"
      gap={4}
      m={m}
      mt={mt}
      mb={mb}
      mx={mx}
      my={my}
      className={className}
      {...props}
    >
      <Flexbox gap={1}>
        <Heading level={level} size={size}>
          {accent && accentAt >= 0 ? (
            <>
              {title.slice(0, accentAt)}
              <span className={styles.accent}>{accent}</span>
              {title.slice(accentAt + accent.length)}
            </>
          ) : (
            title
          )}
        </Heading>
        {description && (
          <Text size="sm" color="subtle">
            {description}
          </Text>
        )}
      </Flexbox>
      {actions && (
        <Flexbox direction="row" align="center" gap={2} shrink={false}>
          {actions}
        </Flexbox>
      )}
    </Flexbox>
  )
}
