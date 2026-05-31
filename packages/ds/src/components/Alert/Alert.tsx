import { mergeClasses } from '@ds/lib/mergeClasses'

import { AlertProps, AlertVariant } from './Alert.types'

const variantClasses: Record<AlertVariant, string> = {
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error:   'bg-red-50 border-red-200 text-red-800',
}

const iconClasses: Record<AlertVariant, string> = {
  info:    'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error:   'text-red-500',
}

const baseAlert = 'flex gap-3 rounded-lg border p-4'
const titleClass = 'text-sm font-semibold'
const bodyClass = 'text-sm'

function AlertIcon({ variant }: { variant: AlertVariant }) {
  const paths: Record<AlertVariant, string> = {
    info:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    error:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={mergeClasses('mt-0.5 h-4 w-4 shrink-0', iconClasses[variant])}
      aria-hidden="true"
    >
      <path d={paths[variant]} />
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
