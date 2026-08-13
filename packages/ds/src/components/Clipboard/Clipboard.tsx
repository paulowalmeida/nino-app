import { Clipboard as ArkClipboard } from '@ark-ui/react/clipboard'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Clipboard.module.css'

type ClipboardProps = {
  /** Text copied to the clipboard and shown in the read-only field */
  value: string
  /** Fired when the value is successfully copied */
  onCopy?: () => void
  className?: string
}

/**
 * Read-only field with a one-click copy button (Ark `Clipboard`).
 * Useful for sharing a Pix code, invite link, or API key.
 *
 * @param value - Text copied and shown in the field
 *
 * @param onCopy - Fired when the value is copied
 */
export function Clipboard({ value, onCopy, className }: ClipboardProps) {
  return (
    <ArkClipboard.Root
      value={value}
      onStatusChange={({ copied }) => copied && onCopy?.()}
    >
      <ArkClipboard.Control className={mergeClasses(styles.field, className)}>
        <ArkClipboard.Input className={styles.valueText} readOnly />
        <ArkClipboard.Trigger className={styles.copyButton}>
          <ArkClipboard.Indicator copied={<Icon name="check" size="sm" />}>
            <Icon name="copy" size="sm" />
          </ArkClipboard.Indicator>
          <ArkClipboard.Indicator copied="Copiado">
            Copiar
          </ArkClipboard.Indicator>
        </ArkClipboard.Trigger>
      </ArkClipboard.Control>
    </ArkClipboard.Root>
  )
}
