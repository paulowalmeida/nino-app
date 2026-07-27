import { mergeClasses } from '@ds/lib/mergeClasses'

import { EmptyStateProps, EmptyStateSize } from './EmptyState.types'

/* Nothing here is not an error, so this takes none of the alert's language:
 * no fill, no border, no icon stamp. It is quiet type on the page itself.
 * The two sizes are two different rooms — `sm` is a line inside a card that
 * already has a heading, `md` is a screen with nothing else on it, and only
 * that one has the space to carry a drawing. */
const baseRoot = 'flex flex-col items-center justify-center text-center'

const sizeRoot: Record<EmptyStateSize, string> = {
  sm: 'gap-1 py-6',
  md: 'gap-1.5 py-10',
}

const titleClass: Record<EmptyStateSize, string> = {
  sm: 'text-sm font-semibold text-subtle',
  md: 'font-display text-lg font-bold text-ink',
}

const bodyClass: Record<EmptyStateSize, string> = {
  sm: 'text-sm leading-relaxed text-faint',
  md: 'max-w-[34ch] text-sm leading-relaxed text-muted',
}

const illustrationClass = 'mb-2.5 [&_img]:h-24 [&_img]:w-24 [&_svg]:h-24'

const actionClass = 'mt-4'

/**
 * Placeholder for a list, panel or screen with nothing in it yet.
 *
 * Reach for `Alert` instead when something went wrong — an empty state is the
 * absence of content, not a status, and it never announces itself to a screen
 * reader the way `role="alert"` does.
 *
 * @param illustration - Drawing above the title. Only rendered at `md`
 *
 * @param title - Short heading naming what is missing
 *
 * @param action - Button or link out of the dead end
 *
 * @param size - `sm` inside a card, `md` for a whole screen. Default: `sm`
 *
 * @param children - Supporting line explaining how to fill it
 *
 * @example
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
  return (
    <div
      className={mergeClasses(baseRoot, sizeRoot[size], className)}
      {...props}
    >
      {size === 'md' && illustration && (
        <div className={illustrationClass} aria-hidden="true">
          {illustration}
        </div>
      )}
      {title && <p className={titleClass[size]}>{title}</p>}
      {children && <p className={bodyClass[size]}>{children}</p>}
      {action && <div className={actionClass}>{action}</div>}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
