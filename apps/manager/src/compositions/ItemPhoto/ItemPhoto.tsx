import { useEffect, useRef, useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { ItemThumb } from '@components/ItemThumb'
import { PhotoCropper } from '@compositions/PhotoCropper'
import { useItemImages } from '@hooks/product/useItemImages'

import type { ItemPhotoProps } from './ItemPhoto.types'

import styles from './ItemPhoto.module.css'

const MAX_BYTES = 4 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'

export const ItemPhoto = ({
  tenantId,
  productId,
  name,
  images,
  onStagedFile,
}: ItemPhotoProps) => {
  const { upload, remove } = useItemImages(tenantId, productId ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chosen, setChosen] = useState<File | null>(null)
  const [stagedUrl, setStagedUrl] = useState<string | null>(null)

  useEffect(() => () => {
    if (stagedUrl) URL.revokeObjectURL(stagedUrl)
  }, [stagedUrl])

  const cover = images.find(({ isPrimary }) => isPrimary) ?? images[0] ?? null

  /** Nada sobe direto: o arquivo escolhido vai para o enquadramento antes. */
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

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
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
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        {stagedUrl || cover ? (
          <img
            src={stagedUrl ?? cover?.url}
            alt={name}
            className={styles.photo}
          />
        ) : (
          <div
            className={
              dragging ? `${styles.empty} ${styles.emptyOver}` : styles.empty
            }
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
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
        <label className={styles.trigger}>
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
            onClick={removeStaged}
          >
            Remover
          </Button>
        )}

        {!stagedUrl && cover && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => remove.mutate(cover.id)}
            loading={remove.isPending}
          >
            Remover
          </Button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
