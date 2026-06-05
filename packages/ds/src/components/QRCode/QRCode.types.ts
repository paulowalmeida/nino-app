import type { ReactNode } from 'react'

export interface QRCodeProps {
  /** Data encoded in the QR code (URL, Pix payload, etc.) */
  value: string
  /** Pixel size of the square. Default: `160` */
  size?: number
  /** Optional logo rendered centered over the code */
  logo?: ReactNode
  className?: string
}
