import mascotSrc from '../../assets/nino_gestor.svg'
import { Image } from '../Image/Image'

type NinoMascotProps = {
  /** Sizing and placement, decided by whoever mounts it */
  className?: string
}

/**
 * The nino cat, as a picture.
 *
 * It stays out of the accessibility tree on purpose: every place it appears
 * already has the brand in visible text next to it (the wordmark, a
 * tagline), so announcing it would only repeat what was just read.
 *
 * `width` and `height` are the drawing's own proportion, not a size — the
 * browser reserves the right box while the file loads, and any class the
 * caller passes still wins.
 *
 * ```tsx
 * <NinoMascot className={styles.mascot} />
 * ```
 */
export function NinoMascot({ className }: NinoMascotProps) {
  return (
    <Image
      src={mascotSrc}
      alt=""
      aria-hidden="true"
      width={300}
      height={300}
      className={className}
    />
  )
}
