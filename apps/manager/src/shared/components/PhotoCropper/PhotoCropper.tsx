import { useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Slider } from '@nino/ds/components/Slider'
import { Text } from '@nino/ds/components/Text'
import { useObjectUrl } from '@shared/hooks/ui/useObjectUrl/useObjectUrl'
import type { CropArea } from '@shared/types/ui/crop-area'
import { cropToArea } from '@shared/utils/crop-image/crop-image'
import { toCenteredCropArea } from '@shared/utils/toCenteredCropArea/toCenteredCropArea'

import motion from '@styles/motion.module.css'
import styles from './PhotoCropper.module.css'

const KEYBOARD_STEP = 0.02
const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1
const DEFAULT_HINT =
  'Arraste a área de recorte para posicionar. Use o zoom para aproximar ou afastar.'

const ARROW_MOVES: Record<string, [number, number]> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
}

const clamp = (value: number, max: number) =>
  Math.min(Math.max(value, 0), Math.max(max, 0))

type Drag = {
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
  const source = useObjectUrl(file)
  const baseAreaRef = useRef<CropArea | null>(null)
  const dragRef = useRef<Drag | null>(null)
  const [area, setArea] = useState<CropArea | null>(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [error, setError] = useState<string | null>(null)

  const startCrop = () => {
    const image = imageRef.current
    if (!image?.naturalWidth || !image.naturalHeight) return
    const ratio = image.naturalWidth / image.naturalHeight
    const initialArea = toCenteredCropArea(ratio, aspectRatio)
    baseAreaRef.current = initialArea
    setZoom(MIN_ZOOM)
    setArea(initialArea)
  }

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    const stage = imageRef.current?.parentElement?.getBoundingClientRect()
    if (!stage || !area) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
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

    setArea({
      ...start.area,
      x: clamp(start.area.x - deltaX * start.area.width, 1 - start.area.width),
      y: clamp(
        start.area.y - deltaY * start.area.height,
        1 - start.area.height
      ),
    })
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const nudge = (event: React.KeyboardEvent<HTMLElement>) => {
    const move = ARROW_MOVES[event.key]
    if (!area || !move) return
    event.preventDefault()

    const [stepX, stepY] = move
    setArea({
      ...area,
      x: clamp(area.x - stepX * KEYBOARD_STEP * area.width, 1 - area.width),
      y: clamp(area.y - stepY * KEYBOARD_STEP * area.height, 1 - area.height),
    })
  }

  const changeZoom = (askedZoom: number) => {
    const baseArea = baseAreaRef.current
    if (!area || !baseArea) return

    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, askedZoom))
    const width = baseArea.width / nextZoom
    const height = baseArea.height / nextZoom
    const centerX = area.x + area.width / 2
    const centerY = area.y + area.height / 2

    setArea({
      x: clamp(centerX - width / 2, 1 - width),
      y: clamp(centerY - height / 2, 1 - height),
      width,
      height,
    })
    setZoom(nextZoom)
  }

  const resetCrop = () => {
    const baseArea = baseAreaRef.current
    if (!baseArea) return
    setArea(baseArea)
    setZoom(MIN_ZOOM)
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
          ? `${motion.deal} ${styles.editor} ${styles.framed}`
          : `${motion.deal} ${styles.editor}`
      }
    >
      <Box
        className={styles.stage}
        style={{
          aspectRatio,
          width: `min(100%, ${52 * aspectRatio}vh)`,
        }}
      >
        {error && (
          <Box className={styles.cropError}>
            <Alert variant="error">{error}</Alert>
          </Box>
        )}
        <img
          ref={imageRef}
          src={source}
          alt="Imagem a recortar"
          draggable={false}
          className={styles.photoCropperImage}
          style={{
            position: 'absolute',
            maxWidth: 'none',
            maxHeight: 'none',
            opacity: area ? 1 : 0,
            ...(area && {
              left: `${(-area.x / area.width) * 100}%`,
              top: `${(-area.y / area.height) * 100}%`,
              width: `${100 / area.width}%`,
              height: `${100 / area.height}%`,
            }),
          }}
          onLoad={startCrop}
        />

        {area && (
          <Box
            tabIndex={0}
            role="group"
            aria-label="Prévia do recorte. Use as setas para mover a imagem."
            className={styles.selection}
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={nudge}
          >
            <Box className={styles.guide} aria-hidden="true" />
          </Box>
        )}
      </Box>

      <Box className={styles.zoomPanel}>
        <div
          className={styles.zoomControls}
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5rem minmax(0, 1fr) 2.5rem',
            alignItems: 'end',
            gap: '0.75rem',
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={styles.zoomButton}
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
            disabled={!area || zoom <= MIN_ZOOM}
            onClick={() => changeZoom(zoom - ZOOM_STEP)}
          >
            <Icon name="zoom-out" size="sm" />
          </Button>
          <Slider
            label="Zoom (%)"
            value={Math.round(zoom * 100)}
            min={MIN_ZOOM * 100}
            max={MAX_ZOOM * 100}
            step={ZOOM_STEP * 100}
            showValue
            disabled={!area}
            className={styles.zoomSlider}
            onValueChange={(value) => changeZoom(value / 100)}
          />
          <Button
            variant="ghost"
            size="icon"
            className={styles.zoomButton}
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
            disabled={!area || zoom >= MAX_ZOOM}
            onClick={() => changeZoom(zoom + ZOOM_STEP)}
          >
            <Icon name="zoom-in" size="sm" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={styles.resetButton}
          disabled={!area}
          onClick={resetCrop}
        >
          <Icon name="rotate-ccw" size="sm" />
          Redefinir enquadramento
        </Button>
      </Box>

      <Text as="p" className={styles.hint}>
        {hint}
      </Text>

      <Box direction="row" className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.cancel}
          onClick={handleCancel}
          disabled={isSending}
        >
          Escolher outra
        </Button>
        <Button
          loading={isSending}
          disabled={!area}
          className={`${motion.press} ${styles.confirm}`}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
        {onRemove && (
          <Button
            variant="danger"
            size="sm"
            className={`${motion.press} ${styles.remove}`}
            onClick={handleRemove}
            disabled={isSending}
          >
            Remover foto
          </Button>
        )}
      </Box>
    </Box>
  )
}
