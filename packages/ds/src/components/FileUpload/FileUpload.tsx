import { FileUpload as ArkFileUpload } from '@ark-ui/react/file-upload'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { FileUploadProps } from './FileUpload.types'

const baseDropzone =
  'group flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center transition-colors cursor-pointer hover:border-brand hover:bg-[color-mix(in_srgb,var(--color-brand)_5%,white)] data-[dragging]:border-brand data-[dragging]:bg-[color-mix(in_srgb,var(--color-brand)_8%,white)]'

const baseItemGroup = 'mt-4 flex flex-col gap-2'

const baseItem =
  'flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm'

const baseItemName = 'flex-1 truncate text-gray-900'
const baseItemSize = 'shrink-0 text-xs text-gray-400'

const baseDeleteButton =
  'shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

const UploadIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  accept,
  maxFiles = 1,
  maxFileSize,
  disabled,
  name,
  onFileChange,
  onFileReject,
  triggerLabel = 'Click to upload',
  dragLabel = 'or drag and drop',
  dropLabel = 'Drop here',
  removeLabel = 'Remove file',
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
      className={mergeClasses('w-full', className)}
    >
      <ArkFileUpload.Dropzone className={baseDropzone}>
        <UploadIcon />
        <div className="group-data-dragging:hidden">
          <ArkFileUpload.Trigger className="font-medium text-brand hover:underline focus-visible:outline-none">
            {triggerLabel}
          </ArkFileUpload.Trigger>
          <span className="text-sm text-gray-500"> {dragLabel}</span>
        </div>
        <p className="hidden text-sm font-medium text-brand group-data-dragging:block">
          {dropLabel}
        </p>
        {maxFileSize && (
          <p className="text-xs text-gray-400 group-data-dragging:hidden">
            Max {formatBytes(maxFileSize)}
          </p>
        )}
        {maxFiles > 1 && (
          <p className="text-xs text-gray-400 group-data-dragging:hidden">
            Up to {maxFiles} files
          </p>
        )}
      </ArkFileUpload.Dropzone>

      <ArkFileUpload.ItemGroup className={baseItemGroup}>
        <ArkFileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <ArkFileUpload.Item
                key={`${file.name}-${file.size}-${file.type}`}
                file={file}
                className={baseItem}
              >
                <ArkFileUpload.ItemPreview type="image/*">
                  <ArkFileUpload.ItemPreviewImage className="h-8 w-8 rounded object-cover" />
                </ArkFileUpload.ItemPreview>
                <ArkFileUpload.ItemName className={baseItemName} />
                <ArkFileUpload.ItemSizeText className={baseItemSize} />
                <ArkFileUpload.ItemDeleteTrigger
                  className={baseDeleteButton}
                  aria-label={removeLabel}
                >
                  <XIcon />
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

FileUpload.displayName = 'FileUpload'
