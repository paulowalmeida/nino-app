import { useEffect, useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import type { CropArea } from '@shared/types/ui/crop-area'
import type { CropCorner } from '@shared/types/ui/crop-corner'
import { cropToArea } from '@shared/utils/crop-image/crop-image'
import { toCenteredCropArea } from '@shared/utils/toCenteredCropArea/toCenteredCropArea'
import { toResizedCropArea } from '@shared/utils/toResizedCropArea/toResizedCropArea'

import motion from '@styles/motion.module.css'
import styles from './PhotoCropper.module.css'

const CORNERS: CropCorner[] = ['nw', 'ne', 'sw', 'se']
const KEYBOARD_STEP = 0.02
const DEFAULT_HINT =
  'Arraste a área para escolher o que aparece. Os cantos mudam o tamanho.'

const ARROW_MOVES: Record<string, [number, number]> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
}

const clamp = (value: number, max: number) =>
  Math.min(Math.max(value, 0), Math.max(max, 0))

type Drag = {
  corner: CropCorner | null
  pointerX: number
  pointerY: number
  stageWidth: number
  stageHeight: number
  area: CropArea
}

export type PhotoCropperProps = {
  file: File
  isSending: boolean
  /** Proporção do recorte, largura ÷ altura. Default: `1` */
  aspectRatio?: number
  /** `false` remove o cartão em volta — para uso dentro de um diálogo. */
  framed?: boolean
  hint?: string
  confirmLabel?: string
  onConfirm: (edited: File) => void
  onCancel: () => void
  /** Quando ausente, o recorte não oferece remoção. */
  onRemove?: () => void
}

export const PhotoCropper = ({
  file,
  isSending,
  aspectRatio = 1,
  framed = true,
  hint = DEFAULT_HINT,
  confirmLabel = 'Usar esta foto',
  onConfirm,
  onCancel,
  onRemove,
}: PhotoCropperProps) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const [source, setSource] = useState<string>()
  const [imageRatio, setImageRatio] = useState(1)
  const [area, setArea] = useState<CropArea | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const nextSource = URL.createObjectURL(file)
    setSource(nextSource)

    return () => {
      URL.revokeObjectURL(nextSource)
    }
  }, [file])

  const startCrop = () => {
    const image = imageRef.current
    if (!image?.naturalWidth || !image.naturalHeight) return
    const ratio = image.naturalWidth / image.naturalHeight
    setImageRatio(ratio)
    setArea(toCenteredCropArea(ratio, aspectRatio))
  }

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    const stage = imageRef.current?.getBoundingClientRect()
    if (!stage || !area) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      corner: (event.currentTarget.dataset.corner ?? null) as CropCorner | null,
      pointerX: event.clientX,
      pointerY: event.clientY,
      stageWidth: stage.width,
      stageHeight: stage.height,
      area,
    }
  }

  const drag = (event: React.PointerEvent<HTMLElement>) => {
    const start = dragRef.current
    if (!start) return
    const deltaX = (event.clientX - start.pointerX) / start.stageWidth
    const deltaY = (event.clientY - start.pointerY) / start.stageHeight

    if (!start.corner) {
      setArea({
        ...start.area,
        x: clamp(start.area.x + deltaX, 1 - start.area.width),
        y: clamp(start.area.y + deltaY, 1 - start.area.height),
      })
      return
    }

    setArea(
      toResizedCropArea({
        area: start.area,
        corner: start.corner,
        deltaX,
        imageRatio,
        aspectRatio,
      })
    )
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const nudge = (event: React.KeyboardEvent<HTMLElement>) => {
    const move = ARROW_MOVES[event.key]
    if (!area || !move) return
    event.preventDefault()

    const [stepX, stepY] = move
    if (event.shiftKey && stepY === 0) {
      setArea(
        toResizedCropArea({
          area,
          corner: 'se',
          deltaX: stepX * KEYBOARD_STEP,
          imageRatio,
          aspectRatio,
        })
      )
      return
    }

    setArea({
      ...area,
      x: clamp(area.x + stepX * KEYBOARD_STEP, 1 - area.width),
      y: clamp(area.y + stepY * KEYBOARD_STEP, 1 - area.height),
    })
  }

  const handleConfirm = async () => {
    const image = imageRef.current
    if (!image || !area) return
    try {
      const edited = await cropToArea(image, area, file.name)
      onConfirm(edited)
    } catch {
      setError('Não foi possível recortar a imagem. Tente novamente.')
    }
  }

  const handleCancel = () => {
    onCancel()
  }

  const handleRemove = () => {
    onRemove?.()
  }

  return (
    <Box
      className={
        framed
          ? `${motion.settle} ${styles.editor} ${styles.framed}`
          : `${motion.settle} ${styles.editor}`
      }
    >
      <Box className={styles.stage}>
        {error && <Alert variant="error">{error}</Alert>}
        <img
          ref={imageRef}
          src={source}
          alt="Imagem a recortar"
          draggable={false}
          className={styles.image}
          onLoad={startCrop}
        />

        {area && (
          <Box
            tabIndex={0}
            role="group"
            aria-label={
              'Área do recorte. Setas movem, shift com as setas ' +
              'esquerda e direita mudam o tamanho.'
            }
            className={styles.selection}
            style={{
              left: `${area.x * 100}%`,
              top: `${area.y * 100}%`,
              width: `${area.width * 100}%`,
              height: `${area.height * 100}%`,
            }}
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={nudge}
          >
            <Box className={styles.guide} aria-hidden="true" />
            {CORNERS.map((corner) => (
              <Box
                key={corner}
                aria-hidden="true"
                className={`${styles.handle} ${styles[corner]}`}
                data-corner={corner}
                onPointerDown={startDrag}
                onPointerMove={drag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            ))}
          </Box>
        )}
      </Box>

      <Text as="p" className={styles.hint}>
        {hint}
      </Text>

      <Box direction="column" gap={2}>
        <Button
          loading={isSending}
          disabled={!area}
          className={`${motion.press} ${styles.confirm}`}
          onClick={handleConfirm}
        >
          {confirmLabel}
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
          {onRemove && (
            <Button
              variant="danger"
              size="sm"
              className={motion.press}
              onClick={handleRemove}
              disabled={isSending}
            >
              Remover foto
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
