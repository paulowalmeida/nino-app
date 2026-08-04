import { useRef, useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Slider } from '@nino/ds/components/Slider'
import { cropToSquare } from '@utils/crop-image'

import styles from './PhotoCropper.module.css'
import motion from '@styles/motion.module.css'

const MIN_ZOOM = 1
const MAX_ZOOM = 3

export type PhotoCropperProps = {
  /** File already chosen, not yet uploaded. */
  file: File
  isSending: boolean
  onConfirm: (edited: File) => void
  onCancel: () => void
  onRemove: () => void
}

/**
 * The framing step before upload: the frame is square like the menu card,
 * the photo fills it and the person drags to pick what stays visible.
 * Nothing reaches the server until confirmed.
 */
export const PhotoCropper = ({
  file,
  isSending,
  onConfirm,
  onCancel,
  onRemove,
}: PhotoCropperProps) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ x: number; y: number } | null>(null)

  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [seed, setSeed] = useState(file)

  /**
   * The URL is born with the component and released on exit — never inside
   * an effect cleanup: in StrictMode the cleanup runs right after mount and
   * would revoke the URL the `<img>` is still about to load.
   */
  const [source] = useState(() => URL.createObjectURL(file))

  if (file !== seed) {
    setSeed(file)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const release = () => URL.revokeObjectURL(source)

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const from = dragRef.current
    if (!from) return

    const side = event.currentTarget.clientWidth
    setOffset((current) => ({
      x: current.x + (event.clientX - from.x) / side,
      y: current.y + (event.clientY - from.y) / side,
    }))
    dragRef.current = { x: event.clientX, y: event.clientY }
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const handleConfirm = async () => {
    const image = imageRef.current
    if (!image) return

    const edited = await cropToSquare(
      image,
      { offsetX: offset.x, offsetY: offset.y, zoom },
      file.name
    )
    release()
    onConfirm(edited)
  }

  const handleCancel = () => {
    release()
    onCancel()
  }

  const handleRemove = () => {
    release()
    onRemove()
  }

  return (
    <div className={`${motion.settle} ${styles.editor}`}>
      <div
        className={styles.frame}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {source && (
          <img
            ref={imageRef}
            src={source}
            alt="Enquadramento da foto"
            draggable={false}
            className={styles.image}
            style={{
              transform: `translate(-50%, -50%) translate(${offset.x * 100}%, ${
                offset.y * 100
              }%) scale(${zoom})`,
            }}
          />
        )}
        <div className={styles.guide} aria-hidden="true" />
      </div>

      <Slider
        label="Aproximar"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.05}
        value={zoom}
        onValueChange={setZoom}
        className={styles.zoom}
      />

      <p className={styles.hint}>
        Arraste a foto para escolher o que aparece. O cardápio mostra o
        quadrado.
      </p>

      <div className={styles.actions}>
        <Button
          loading={isSending}
          className={`${motion.press} ${styles.confirm}`}
          onClick={handleConfirm}
        >
          Usar esta foto
        </Button>

        <div className={styles.secondary}>
          <Button
            variant="ghost"
            size="sm"
            className={motion.press}
            onClick={handleCancel}
            disabled={isSending}
          >
            Escolher outra
          </Button>
          <Button
            variant="danger"
            size="sm"
            className={motion.press}
            onClick={handleRemove}
            disabled={isSending}
          >
            Remover foto
          </Button>
        </div>
      </div>
    </div>
  )
}
