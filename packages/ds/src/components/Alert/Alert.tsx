import { mergeClasses } from '@ds/lib/mergeClasses'
import { statusIconPaths } from '@ds/lib/statusIconPaths'

import { AlertProps, AlertVariant } from './Alert.types'

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

const iconClasses: Record<AlertVariant, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
}

const baseAlert = 'flex gap-3 rounded-lg border p-4'
const titleClass = 'text-sm font-semibold'
const bodyClass = 'text-sm'

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
