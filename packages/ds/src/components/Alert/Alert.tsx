import { mergeClasses } from '@ds/lib/mergeClasses'
import { statusIconPaths } from '@ds/lib/statusIconPaths'

import { AlertProps, AlertVariant } from './Alert.types'

/**
 * An alert lives inside the page and often several sit on the same screen, so
 * flooding it with saturated fill — the toast's move — would leave nowhere to
 * rest. It keeps the pale surface and concentrates the solid colour in one
 * stamp: the icon block. Same language as the toast (flat fill, contrasting
 * mark on top, no border), applied to a square centimetre instead of the
 * whole card.
 */
const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-cream-deep text-body',
  success: 'bg-success-surface text-success',
  warning: 'bg-warning-surface text-warning',
  error: 'bg-danger-surface text-danger',
}

const stampClasses: Record<AlertVariant, string> = {
  info: 'bg-brand-strong text-cream',
  success: 'bg-success text-cream',
  warning: 'bg-warning-bright text-ink',
  error: 'bg-danger text-cream',
}

const baseAlert = 'flex gap-3 rounded-card p-4'
const stampClass = 'grid size-7 shrink-0 place-items-center rounded-[6px]'
const titleClass = 'font-display text-sm font-semibold tracking-[-0.01em]'
const bodyClass = 'text-[0.8125rem] leading-[1.45] opacity-80'

function AlertStamp({ variant }: { variant: AlertVariant }) {
  return (
    <span className={mergeClasses(stampClass, stampClasses[variant])}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-[15px]"
        aria-hidden="true"
      >
        <path d={statusIconPaths[variant]} />
      </svg>
    </span>
  )
}

/**
 * Inline alert message for status feedback.
 *
 * @param variant - Alert type. Default: `info`
 *
 * @param title - Optional bold heading
 *
 * @param children - Alert body content
 *
 * @example
 * <Alert variant="success" title="Saved!">Your changes have been saved.</Alert>
 * <Alert variant="error">An unexpected error occurred.</Alert>
 */
export function Alert({
  variant = 'info',
  title,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={mergeClasses(baseAlert, variantClasses[variant], className)}
      {...props}
    >
      <AlertStamp variant={variant} />
      <div className="flex flex-col gap-1 pt-0.5">
        {title && <p className={titleClass}>{title}</p>}
        {children && <p className={bodyClass}>{children}</p>}
      </div>
    </div>
  )
}
