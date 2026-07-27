import { Clipboard as ArkClipboard } from '@ark-ui/react/clipboard'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { ClipboardProps } from './Clipboard.types'

const baseControl =
  'flex items-center gap-2 w-full h-10 rounded-card border border-transparent bg-surface-sunk pl-3 pr-1 ' +
  'transition-colors focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand'

const baseInput = 'flex-1 min-w-0 bg-transparent text-sm text-ink outline-none'

const triggerClass =
  'shrink-0 inline-flex h-8 items-center gap-1.5 rounded-[6px] px-3 ' +
  'text-sm font-semibold text-cream bg-body transition-colors ' +
  'cursor-pointer outline-none hover:bg-ink focus-visible:outline-2 ' +
  'focus-visible:outline-brand focus-visible:outline-offset-2'

const CopyIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

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
      <ArkClipboard.Control className={mergeClasses(baseControl, className)}>
        <ArkClipboard.Input className={baseInput} readOnly />
        <ArkClipboard.Trigger className={triggerClass}>
          <ArkClipboard.Indicator copied={<CheckIcon />}>
            <CopyIcon />
          </ArkClipboard.Indicator>
          <ArkClipboard.Indicator copied="Copiado">
            Copiar
          </ArkClipboard.Indicator>
        </ArkClipboard.Trigger>
      </ArkClipboard.Control>
    </ArkClipboard.Root>
  )
}

Clipboard.displayName = 'Clipboard'
