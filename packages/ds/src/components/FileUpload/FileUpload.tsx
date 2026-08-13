import { FileUpload as ArkFileUpload } from '@ark-ui/react/file-upload'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './FileUpload.module.css'

type FileUploadProps = {
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
  /** Clickable trigger label. Default: `'Escolher arquivo'` */
  triggerLabel?: string
  /** Hint shown next to the trigger. Default: `'ou arraste até aqui'` */
  dragLabel?: string
  /** Text shown while a file is dragged over. Default: `'Solte aqui'` */
  dropLabel?: string
  /** Label for the remove-file button. Default: `'Remover arquivo'` */
  removeLabel?: string
  className?: string
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Dropzone that takes a file by click or by drag, listing what came in.
 *
 * @param accept - Accepted MIME types
 *
 * @param maxFiles - How many files at once. Default: `1`
 *
 * @param maxFileSize - Ceiling in bytes. Shown under the trigger when set
 *
 * @param onFileChange - Called with the accepted files
 *
 * @param onFileReject - Called with what was refused, and why
 *
 * @example
 * <FileUpload
 *   accept={{ 'image/*': ['.png', '.jpg'] }}
 *   maxFileSize={2 * 1024 * 1024}
 *   onFileChange={setFiles}
 * />
 */
export function FileUpload({
  accept,
  maxFiles = 1,
  maxFileSize,
  disabled,
  name,
  onFileChange,
  onFileReject,
  triggerLabel = 'Escolher arquivo',
  dragLabel = 'ou arraste até aqui',
  dropLabel = 'Solte aqui',
  removeLabel = 'Remover arquivo',
  className,
}: FileUploadProps) {
  return (
    <ArkFileUpload.Root
      accept={accept}
      maxFiles={maxFiles}
      maxFileSize={maxFileSize}
      disabled={disabled}
      name={name}
      onFileChange={({ acceptedFiles }) => onFileChange?.(acceptedFiles)}
      onFileReject={onFileReject}
      className={mergeClasses(styles.fileUpload, className)}
    >
      <ArkFileUpload.Dropzone className={styles.dropzone}>
        <Icon name="upload" size="xl" className={styles.uploadIcon} />
        <div className={styles.restingPrompt}>
          <ArkFileUpload.Trigger className={styles.browseButton}>
            {triggerLabel}
          </ArkFileUpload.Trigger>
          <span className={styles.dragHint}> {dragLabel}</span>
        </div>
        <p className={styles.dropHint}>{dropLabel}</p>
        {maxFileSize && (
          <p className={styles.limitHint}>
            Até {formatBytes(maxFileSize)} por arquivo
          </p>
        )}
        {maxFiles > 1 && (
          <p className={styles.limitHint}>No máximo {maxFiles} arquivos</p>
        )}
      </ArkFileUpload.Dropzone>

      <ArkFileUpload.ItemGroup className={styles.fileList}>
        <ArkFileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <ArkFileUpload.Item
                key={`${file.name}-${file.size}-${file.type}`}
                file={file}
                className={styles.fileRow}
              >
                <ArkFileUpload.ItemPreview type="image/*">
                  <ArkFileUpload.ItemPreviewImage
                    className={styles.previewImage}
                  />
                </ArkFileUpload.ItemPreview>
                <ArkFileUpload.ItemName className={styles.itemName} />
                <ArkFileUpload.ItemSizeText className={styles.itemSize} />
                <ArkFileUpload.ItemDeleteTrigger
                  className={styles.deleteButton}
                  aria-label={removeLabel}
                >
                  <Icon name="x" size="sm" />
                </ArkFileUpload.ItemDeleteTrigger>
              </ArkFileUpload.Item>
            ))
          }
        </ArkFileUpload.Context>
      </ArkFileUpload.ItemGroup>

      <ArkFileUpload.HiddenInput />
    </ArkFileUpload.Root>
  )
}
