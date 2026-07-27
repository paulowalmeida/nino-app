import { mergeClasses } from '@ds/lib/mergeClasses'
import { statusIconPaths } from '@ds/lib/statusIconPaths'

import { AlertProps, AlertVariant } from './Alert.types'

/**
 * The alert is the toast's counterpart: same status family, inverted pair.
 * A toast interrupts and leaves, so it takes the saturated fill; an alert
 * stays on the page, so it takes the pale surface of the same hue with the
 * dark tone on top. No border and no shadow — it sits in the layout, it does
 * not float above it.
 */
const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-cream-deep text-body',
  success: 'bg-success-surface text-success',
  warning: 'bg-warning-surface text-warning',
  error: 'bg-danger-surface text-danger',
}

const iconClasses: Record<AlertVariant, string> = {
  info: 'text-brand-strong',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-danger',
}

const baseAlert = 'flex gap-3 rounded-card p-4'
const titleClass = 'font-display text-sm font-semibold tracking-[-0.01em]'
const bodyClass = 'text-[0.8125rem] leading-[1.45]'

function AlertIcon({ variant }: { variant: AlertVariant }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={mergeClasses('mt-0.5 h-4 w-4 shrink-0', iconClasses[variant])}
      aria-hidden="true"
    >
      <path d={statusIconPaths[variant]} />
    </svg>
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
      <AlertIcon variant={variant} />
      <div className="flex flex-col gap-1">
        {title && <p className={titleClass}>{title}</p>}
        {children && <p className={bodyClass}>{children}</p>}
      </div>
    </div>
  )
}
