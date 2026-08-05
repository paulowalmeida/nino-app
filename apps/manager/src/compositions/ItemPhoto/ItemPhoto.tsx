import { useEffect, useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { ItemThumb } from '@components/ItemThumb/ItemThumb'
import { PhotoCropper } from '@compositions/PhotoCropper/PhotoCropper'
import { useItemImages } from '@hooks/product/useItemImages'
import type { MenuItemImage } from '@custom_types/product/menu-item-image'
import styles from './ItemPhoto.module.css'
import motion from '@styles/motion.module.css'

const MAX_BYTES = 4 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'

export type ItemPhotoProps = {
  tenantId: string | null
  productId: string | null
  name: string
  images: MenuItemImage[]
  onStagedFile?: (file: File | null) => void
}

export const ItemPhoto = ({
  tenantId,
  productId,
  name,
  images,
  onStagedFile,
}: ItemPhotoProps) => {
  const { upload, remove } = useItemImages(tenantId, productId ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
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

    upload.mutate(edited, {
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
    if (cover) remove.mutate(cover.id)
    setChosen(null)
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    choose(event.dataTransfer.files[0])
  }

  if (chosen) {
    return (
      <div className={styles.wrap}>
        <PhotoCropper
          key={`${chosen.name}-${chosen.size}`}
          file={chosen}
          isSending={upload.isPending}
          onConfirm={send}
          onCancel={() => setChosen(null)}
          onRemove={removeFromCropper}
        />
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div
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
          <img
            src={stagedUrl ?? cover?.url}
            alt={name}
            className={styles.photo}
          />
        ) : (
          <div className={styles.empty}>
            <ItemThumb name={name} />
            <p className={styles.emptyTitle}>Arraste uma foto aqui</p>
            <p className={styles.emptyHint}>
              JPG, PNG ou WebP, até 4 MB. É a imagem que o cliente vê no
              cardápio.
            </p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <label className={`${motion.press} ${styles.trigger}`}>
          {stagedUrl || cover ? 'Trocar foto' : 'Escolher arquivo'}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.fileInput}
            onChange={(event) => choose(event.target.files?.[0])}
          />
        </label>

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
            onClick={() => remove.mutate(cover.id)}
            loading={remove.isPending}
          >
            Remover
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  )
}
