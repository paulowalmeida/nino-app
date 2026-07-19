import { useRef, useState } from 'react'

import { ItemThumb } from '@components/ItemThumb'
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
}: ItemPhotoProps) => {
  const { upload, remove } = useItemImages(tenantId, productId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cover = images.find(({ isPrimary }) => isPrimary) ?? images[0] ?? null

  const send = (file: File | undefined) => {
    setError(null)
    if (!file) return

    if (file.size > MAX_BYTES) {
      setError('A imagem precisa ter no máximo 4 MB')
      return
    }

    upload.mutate(file, {
      onError: (cause) => setError(cause.message),
    })
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
    send(event.dataTransfer.files[0])
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        {cover ? (
          <img src={cover.url} alt={name} className={styles.photo} />
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

        {upload.isPending && <p className={styles.sending}>Enviando…</p>}
      </div>

      <div className={styles.actions}>
        <label className={styles.trigger}>
          {cover ? 'Trocar foto' : 'Escolher arquivo'}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.fileInput}
            onChange={(event) => send(event.target.files?.[0])}
          />
        </label>

        {cover && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => remove.mutate(cover.id)}
            disabled={remove.isPending}
          >
            {remove.isPending ? 'Removendo…' : 'Remover'}
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
