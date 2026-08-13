import { HTMLAttributes } from 'react'

import { Flexbox } from '@ds/components/Flexbox/Flexbox'
import { Icon } from '@ds/components/Icon/Icon'
import { Stamp, StampTone } from '@ds/components/Stamp/Stamp'
import { Text } from '@ds/components/Text/Text'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Alert.module.css'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  /** Alert type. Default: `info` */
  variant?: AlertVariant
  /** Optional bold heading */
  title?: string
}

const variantClasses: Record<AlertVariant, string> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
}

const stampTones: Record<AlertVariant, StampTone> = {
  info: 'brandStrong',
  success: 'success',
  warning: 'warning',
  error: 'danger',
}

/**
 * Inline alert message for status feedback.
 *
 * ```tsx
 * <Alert variant="success" title="Saved!">Your changes have been saved.</Alert>
 * <Alert variant="error">An unexpected error occurred.</Alert>
 *
 * - `children` — Alert body content
 * ```
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
      className={mergeClasses(styles.alert, variantClasses[variant], className)}
      {...props}
    >
      <Stamp size="md" tone={stampTones[variant]}>
        <Icon name={`status-${variant}`} size="sm" />
      </Stamp>
      <Flexbox gap={1} className={styles.textStack}>
        {title && (
          <Text
            size="sm"
            weight="semibold"
            font="display"
            className={styles.title}
          >
            {title}
          </Text>
        )}
        {children && (
          <Text size="sm" className={styles.message}>
            {children}
          </Text>
        )}
      </Flexbox>
    </div>
  )
}
