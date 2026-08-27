import { useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Slider } from '@nino/ds/components/Slider'
import { Text } from '@nino/ds/components/Text'
import { cropToSquare } from '@shared/utils/crop-image/crop-image'

import motion from '@styles/motion.module.css'
import styles from './PhotoCropper.module.css'

const MIN_ZOOM = 1
const MAX_ZOOM = 3

export type PhotoCropperProps = {
  file: File
  isSending: boolean
  onConfirm: (edited: File) => void
  onCancel: () => void
  onRemove: () => void
}

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
    <Box className={`${motion.settle} ${styles.editor}`}>
      <Box
        className={styles.frame}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* The crop algorithm requires the live HTMLImageElement through a ref. */}
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
        <Box className={styles.guide} aria-hidden="true" />
      </Box>

      <Slider
        label="Aproximar"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.05}
        value={zoom}
        onValueChange={setZoom}
        className={styles.zoom}
      />

      <Text as="p" className={styles.hint}>
        Arraste a foto para escolher o que aparece. O cardápio mostra o
        quadrado.
      </Text>

      <Box direction="column" gap={2}>
        <Button
          loading={isSending}
          className={`${motion.press} ${styles.confirm}`}
          onClick={handleConfirm}
        >
          Usar esta foto
        </Button>
        <Box gap={2} align="center" justify="between">
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
        </Box>
      </Box>
    </Box>
  )
}
