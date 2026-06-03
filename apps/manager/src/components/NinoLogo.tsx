type NinoLogoProps = {
  className?: string
  tone?: 'light' | 'dark'
}

export function NinoLogo({ className, tone = 'dark' }: NinoLogoProps) {
  const root = 'inline-flex items-center gap-2.5'
  const mark = 'relative inline-flex h-16 w-16 items-center justify-center'
  const markBg = 'absolute inset-0 rounded-full bg-brand/15'
  const markLetter = 'font-display text-[32px] font-extrabold text-brand'
  const stack = 'inline-flex flex-col'
  const wordmark =
    'font-display text-4xl font-extrabold leading-none tracking-tight text-brand'
  const label = 'text-2xl font-semibold tracking-[0.25em] leading-none mt-1'
  const labelLight = 'text-white/60'
  const labelDark = 'text-gray-400'
  const labelColor = tone === 'light' ? labelLight : labelDark

  return (
    <div className={`${root} ${className ?? ''}`}>
      <span className={mark}>
        <span className={markBg} />
        <span className={markLetter}>n</span>
      </span>
      <span className={stack}>
        <span className={wordmark}>nino</span>
        <span className={`${label} ${labelColor}`}>GESTOR</span>
      </span>
    </div>
  )
}
