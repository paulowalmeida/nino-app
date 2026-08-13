import { ReactNode } from 'react'

import { QrCode as ArkQrCode } from '@ark-ui/react/qr-code'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './QRCode.module.css'

type QRCodeProps = {
  /** What gets encoded — a URL, a Pix payload */
  value: string
  /**
   * Side of the square in pixels, white margin included. The drawing itself
   * comes out smaller than this. Default: `160`
   */
  size?: number
  /**
   * Mark centred over the code. The pattern carries enough redundancy for a
   * small one, but a large mark stops it from being read
   */
  logo?: ReactNode
  /** What a screen reader announces */
  label?: string
  className?: string
}

/**
 * QR code for what has to jump from a screen to a phone — the store link,
 * a Pix payload, the menu on a table.
 *
 * The code itself says nothing to a screen reader, so `label` is what names
 * it. And a code is never the only way in: whatever it encodes has to be
 * reachable as text or a link next to it, for whoever cannot point a camera
 * at it.
 *
 * ```tsx
 * <QRCode value={storeUrl} label="Código do cardápio" />
 * ```
 */
export function QRCode({
  value,
  size = 160,
  logo,
  label,
  className,
}: QRCodeProps) {
  return (
    <ArkQrCode.Root
      value={value}
      role="img"
      aria-label={label}
      className={mergeClasses(styles.codeCard, className)}
      style={{ width: size, height: size }}
    >
      <ArkQrCode.Frame className={styles.frame}>
        <ArkQrCode.Pattern />
      </ArkQrCode.Frame>
      {logo && (
        <ArkQrCode.Overlay className={styles.logoBadge}>
          {logo}
        </ArkQrCode.Overlay>
      )}
    </ArkQrCode.Root>
  )
}
