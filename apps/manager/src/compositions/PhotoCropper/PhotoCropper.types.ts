export type PhotoCropperProps = {
  /** Arquivo escolhido, ainda não enviado. */
  file: File
  isSending: boolean
  onConfirm: (edited: File) => void
  onCancel: () => void
  onRemove: () => void
}
