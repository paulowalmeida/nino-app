import { QrCode as ArkQrCode } from '@ark-ui/react/qr-code'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { QRCodeProps } from './QRCode.types'

const baseRoot = 'inline-block rounded-card bg-white p-3'

const frameClass = 'h-full w-full [&_path]:fill-ink'

const overlayClass =
  'flex items-center justify-center rounded-card bg-white p-1 shadow-card'

/**
 * Renders a QR code (Ark `QrCode`) — share a store link, Pix, or menu.
 *
 * @param value - Data encoded in the QR code
 *
 * @param size - Pixel size of the square. Default: `160`
 *
 * @param logo - Optional logo centered over the code
 */
export function QRCode({ value, size = 160, logo, className }: QRCodeProps) {
  return (
    <ArkQrCode.Root
      value={value}
      className={mergeClasses(baseRoot, className)}
      style={{ width: size, height: size }}
    >
      <ArkQrCode.Frame className={frameClass}>
        <ArkQrCode.Pattern />
      </ArkQrCode.Frame>
      {logo && (
        <ArkQrCode.Overlay className={overlayClass}>{logo}</ArkQrCode.Overlay>
      )}
    </ArkQrCode.Root>
  )
}

QRCode.displayName = 'QRCode'
