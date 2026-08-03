import mascotSrc from '../../assets/mascot.svg'

export interface NinoMascotProps {
  className?: string
}

/**
 * Every current usage pairs the mascot with visible brand text nearby
 * (wordmark, tagline) — it adds no information on its own, so it stays out
 * of the accessibility tree instead of announcing redundant alt text.
 */
export function NinoMascot({ className }: NinoMascotProps) {
  return <img src={mascotSrc} alt="" aria-hidden="true" className={className} />
}
