export interface FileUploadProps {
  /** Accepted MIME types. E.g. `{ 'image/*': ['.png', '.jpg'] }` */
  accept?: Record<string, string[]>
  maxFiles?: number
  /** Max file size in bytes */
  maxFileSize?: number
  disabled?: boolean
  name?: string
  onFileChange?: (files: File[]) => void
  onFileReject?: (details: {
    files: { file: File; errors: string[] }[]
  }) => void
  /** Clickable trigger label. Default: `'Click to upload'` */
  triggerLabel?: string
  /** Hint shown next to the trigger. Default: `'or drag and drop'` */
  dragLabel?: string
  /** Text shown while a file is dragged over the dropzone. Default: `'Drop here'` */
  dropLabel?: string
  /** Label for the remove-file button. Default: `'Remove file'` */
  removeLabel?: string
  className?: string
}
