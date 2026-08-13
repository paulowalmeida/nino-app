import { HTMLAttributes, ReactNode } from 'react'

import { Text } from '@ds/components/Text/Text'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './EmptyState.module.css'

/* Nothing here is not an error, so this takes none of the alert's language:
 * no fill, no border, no icon stamp. It is quiet type on the page itself.
 * The two sizes are two different rooms — `sm` is a line inside a card that
 * already has a heading, `md` is a screen with nothing else on it, and only
 * that one has the space to carry a drawing. */
type EmptyStateSize = 'sm' | 'md'

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  /** Illustration or icon shown above the title. Only rendered at `md`. */
  illustration?: ReactNode
  /** Short heading naming what is missing. */
  title?: string
  /** Call to action — a button or link out of the dead end. */
  action?: ReactNode
  /** `sm` sits inside a card or list; `md` fills the screen. Default: `sm` */
  size?: EmptyStateSize
}

const sizeClasses: Record<EmptyStateSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
}

/**
 * Placeholder for a list, panel or screen with nothing in it yet.
 *
 * Reach for `Alert` instead when something went wrong — an empty state is the
 * absence of content, not a status, and it never announces itself to a screen
 * reader the way `role="alert"` does.
 *
 * ```tsx
 * <EmptyState>Nenhum telefone cadastrado.</EmptyState>
 *
 * @example
 * <EmptyState
 *   size="md"
 *   illustration={<img src="/mascot.svg" alt="" />}
 *   title="Sua sacola está vazia"
 *   action={<Button>Ver o cardápio</Button>}
 * >
 *   Volte ao cardápio e escolha o que vai pedir.
 * </EmptyState>
 *
 * - `illustration` — Drawing above the title. Only rendered at `md`
 * - `title` — Short heading naming what is missing
 * - `action` — Button or link out of the dead end
 * - `size` — `sm` inside a card, `md` for a whole screen. Default: `sm`
 * - `children` — Supporting line explaining how to fill it
 * ```
 */
export function EmptyState({
  illustration,
  title,
  action,
  size = 'sm',
  className,
  children,
  ...props
}: EmptyStateProps) {
  const isFullScreen = size === 'md'

  return (
    <div
      className={mergeClasses(styles.emptyState, sizeClasses[size], className)}
      {...props}
    >
      {isFullScreen && illustration && (
        <div className={styles.illustration} aria-hidden="true">
          {illustration}
        </div>
      )}
      {title &&
        (isFullScreen ? (
          <Text size="lg" weight="bold" font="display" color="strong">
            {title}
          </Text>
        ) : (
          <Text size="sm" weight="semibold" color="subtle">
            {title}
          </Text>
        ))}
      {children && (
        <Text
          size="sm"
          color={isFullScreen ? 'muted' : 'faint'}
          className={isFullScreen ? styles.messageWide : styles.messageNarrow}
        >
          {children}
        </Text>
      )}
      {action && <div className={styles.actionSlot}>{action}</div>}
    </div>
  )
}
