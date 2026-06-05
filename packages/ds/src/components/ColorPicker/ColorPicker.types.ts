export interface ColorPickerProps {
  /** Controlled color as a hex string (e.g. `#FF6B00`) */
  value?: string
  /** Uncontrolled initial color as a hex string. Default: `#FF6B00` */
  defaultValue?: string
  /** Fired with the new hex string as the color changes */
  onValueChange?: (hex: string) => void
  /** Preset swatches offered below the picker */
  presets?: string[]
  disabled?: boolean
  className?: string
}
