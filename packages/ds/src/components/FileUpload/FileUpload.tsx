import { FileUpload as ArkFileUpload } from '@ark-ui/react/file-upload'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './FileUpload.module.css'

type FileUploadProps = {
  /** Accepted MIME types. E.g. `{ 'image/*': ['.png', '.jpg'] }` */
  accept?: Record<string, string[]>
  /** How many files at once. Default: `1` */
  maxFiles?: number
  /** Max file size in bytes */
  maxFileSize?: number
  disabled?: boolean
  name?: string
  /** Called with the accepted files */
  onFileChange?: (files: File[]) => void
  /** Called with what was refused, and why */
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
  /**
   * Percentage sent so far, keyed by file name. A file listed here draws a
   * progress bar along the bottom of its row until it reaches 100. Files
   * left out of the map show no bar — the component only selects files,
   * whoever sends them owns the number.
   */
  uploadProgressByFile?: Record<string, number>
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
 * ```tsx
 * <FileUpload
 *   accept={{ 'image/*': ['.png', '.jpg'] }}
 *   maxFileSize={2 * 1024 * 1024}
 *   onFileChange={setFiles}
 * />
 *
 * - `accept` — Accepted MIME types
 * - `maxFileSize` — Ceiling in bytes. Shown under the trigger when set
 * ```
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
  uploadProgressByFile,
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
      {/* `group` fica literal: é o marcador que o ícone e as dicas leem para
          reagir ao arquivo arrastado por cima. */}
      <ArkFileUpload.Dropzone
        className={mergeClasses('group', styles.dropzone)}
      >
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
            acceptedFiles.map((file) => {
              const percentSent = uploadProgressByFile?.[file.name]
              const isSending = percentSent !== undefined && percentSent < 100

              return (
                <ArkFileUpload.Item
                  key={`${file.name}-${file.size}-${file.type}`}
                  file={file}
                  className={styles.fileRow}
                >
                  {isSending && (
                    <span
                      role="progressbar"
                      aria-label={`Enviando ${file.name}`}
                      aria-valuenow={Math.round(percentSent)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className={styles.progressTrack}
                    >
                      <span
                        className={styles.progressFill}
                        style={{ width: `${percentSent}%` }}
                      />
                    </span>
                  )}
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
              )
            })
          }
        </ArkFileUpload.Context>
      </ArkFileUpload.ItemGroup>

      <ArkFileUpload.HiddenInput />
    </ArkFileUpload.Root>
  )
}
