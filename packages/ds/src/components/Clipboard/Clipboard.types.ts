export interface ClipboardProps {
  /** Text copied to the clipboard and shown in the read-only field */
  value: string
  /** Fired when the value is successfully copied */
  onCopy?: () => void
  className?: string
}
