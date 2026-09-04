import { useState } from 'react'

import { FileUpload } from '@nino/ds/components/FileUpload'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { PhotoCropper } from '@shared/components/PhotoCropper/PhotoCropper'

export type BrandAssetSlotProps = {
  label: string
  helperText: string
  triggerLabel: string
  framingTitle: string
  framingHint: string
  confirmLabel: string
  /** Proporção do recorte, largura ÷ altura. */
  aspectRatio: number
  onCropped: (file: File) => void
}

const IMAGE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
}

const MAX_FILE_SIZE = 4 * 1024 * 1024
const WIDE_RATIO = 2

export const BrandAssetSlot = ({
  label,
  helperText,
  triggerLabel,
  framingTitle,
  framingHint,
  confirmLabel,
  aspectRatio,
  onCropped,
}: BrandAssetSlotProps) => {
  const [chosenFile, setChosenFile] = useState<File | null>(null)
  const [dropzoneKey, setDropzoneKey] = useState(0)

  const close = () => {
    setChosenFile(null)
    setDropzoneKey((current) => current + 1)
  }

  return (
    <>
      <FormField label={label} helperText={helperText}>
        <FileUpload
          key={dropzoneKey}
          accept={IMAGE_TYPES}
          maxFileSize={MAX_FILE_SIZE}
          triggerLabel={triggerLabel}
          onFileChange={(files) => setChosenFile(files[0] ?? null)}
        />
      </FormField>

      <Modal
        open={!!chosenFile}
        size={aspectRatio >= WIDE_RATIO ? 'lg' : 'md'}
        onOpenChange={(isOpen) => {
          if (!isOpen) close()
        }}
        header={
          <Heading level={2} size="lg">
            {framingTitle}
          </Heading>
        }
        body={
          chosenFile && (
            <PhotoCropper
              key={`${chosenFile.name}-${chosenFile.size}`}
              file={chosenFile}
              isSending={false}
              framed={false}
              aspectRatio={aspectRatio}
              hint={framingHint}
              confirmLabel={confirmLabel}
              onConfirm={(edited) => {
                onCropped(edited)
                close()
              }}
              onCancel={close}
            />
          )
        }
      />
    </>
  )
}
