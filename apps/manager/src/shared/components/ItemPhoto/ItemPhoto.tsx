import { useEffect, useId, useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Text } from '@nino/ds/components/Text'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import { PhotoCropper } from '@shared/components/PhotoCropper/PhotoCropper'
import type { MenuItemImage } from '@shared/types/product/menu-item-image'

import motion from '@styles/motion.module.css'
import styles from './ItemPhoto.module.css'

const MAX_BYTES = 4 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'

export type ItemPhotoProps = {
  productId: string | null
  name: string
  images: MenuItemImage[]
  fallbackUrl?: string | null
  onStagedFile?: (file: File | null) => void
  isUploading?: boolean
  isRemoving?: boolean
  onUpload?: (
    file: File,
    callbacks: { onSuccess: () => void; onError: (cause: Error) => void }
  ) => void
  onRemove?: (imageId: string) => void
}

export const ItemPhoto = ({
  productId,
  name,
  images,
  fallbackUrl,
  onStagedFile,
  isUploading = false,
  isRemoving = false,
  onUpload,
  onRemove,
}: ItemPhotoProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chosen, setChosen] = useState<File | null>(null)
  const [stagedUrl, setStagedUrl] = useState<string | null>(null)

  useEffect(
    () => () => {
      if (stagedUrl) URL.revokeObjectURL(stagedUrl)
    },
    [stagedUrl]
  )

  const cover = images.find(({ isPrimary }) => isPrimary) ?? images[0] ?? null

  const choose = (file: File | undefined) => {
    setError(null)
    if (!file) return
    if (file.size > MAX_BYTES) {
      setError('A imagem precisa ter no máximo 4 MB')
      return
    }
    setChosen(file)
  }

  const send = (edited: File) => {
    if (!productId) {
      setStagedUrl(URL.createObjectURL(edited))
      onStagedFile?.(edited)
      setChosen(null)
      return
    }

    onUpload?.(edited, {
      onSuccess: () => setChosen(null),
      onError: (cause) => setError(cause.message),
    })
  }

  const removeStaged = () => {
    if (stagedUrl) URL.revokeObjectURL(stagedUrl)
    setStagedUrl(null)
    onStagedFile?.(null)
  }

  const removeFromCropper = () => {
    if (stagedUrl) removeStaged()
    if (cover) onRemove?.(cover.id)
    setChosen(null)
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    choose(event.dataTransfer.files[0])
  }

  if (chosen) {
    return (
      <Box direction="column" gap={3}>
        <PhotoCropper
          key={`${chosen.name}-${chosen.size}`}
          file={chosen}
          isSending={isUploading}
          onConfirm={send}
          onCancel={() => setChosen(null)}
          onRemove={removeFromCropper}
        />
        {error && <Alert variant="error">{error}</Alert>}
      </Box>
    )
  }

  return (
    <Box className={styles.wrap}>
      <Box
        className={
          isDragging
            ? `${motion.settle} ${styles.frame} ${styles.frameOver}`
            : `${motion.settle} ${styles.frame}`
        }
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {stagedUrl || cover ? (
          <Image
            src={stagedUrl ?? cover?.url}
            alt={name}
            className={styles.photo}
          />
        ) : (
          <Box className={styles.itemPhotoEmpty}>
            <ItemThumb name={name} fallbackUrl={fallbackUrl} />
            <Text as="p" className={styles.emptyTitle}>
              Arraste uma foto aqui
            </Text>
            <Text as="p" className={styles.emptyHint}>
              JPG, PNG ou WebP, até 4 MB. É a imagem que o cliente vê no
              cardápio.
            </Text>
          </Box>
        )}
      </Box>

      <Box gap={2} align="center" wrap>
        <Label
          htmlFor={inputId}
          className={`${motion.press} ${styles.itemPhotoTrigger}`}
        >
          {stagedUrl || cover ? 'Trocar foto' : 'Escolher arquivo'}
          <Input
            id={inputId}
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.fileInput}
            onChange={(event) => choose(event.target.files?.[0])}
          />
        </Label>

        {stagedUrl && (
          <Button
            variant="danger"
            size="sm"
            className={motion.press}
            onClick={removeStaged}
          >
            Remover
          </Button>
        )}

        {!stagedUrl && cover && (
          <Button
            variant="danger"
            size="sm"
            className={motion.press}
            onClick={() => onRemove?.(cover.id)}
            loading={isRemoving}
          >
            Remover
          </Button>
        )}
      </Box>

      {error && <Alert variant="error">{error}</Alert>}
    </Box>
  )
}
