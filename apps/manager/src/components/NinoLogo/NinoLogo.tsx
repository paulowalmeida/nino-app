import type { NinoLogoProps } from './NinoLogo.types'

const sizes = {
  sm: {
    mark: 'h-9 w-9',
    letter: 'text-xl',
    wordmark: 'text-xl',
    label: 'text-[10px]',
  },
  md: {
    mark: 'h-12 w-12',
    letter: 'text-2xl',
    wordmark: 'text-2xl',
    label: 'text-sm',
  },
  lg: {
    mark: 'h-16 w-16',
    letter: 'text-[32px]',
    wordmark: 'text-4xl',
    label: 'text-2xl',
  },
}

const root = 'inline-flex items-center gap-2.5'
const markBase = 'relative inline-flex items-center justify-center'
const markBg = 'absolute inset-0 rounded-full bg-brand/15'
const letterBase = 'font-display font-extrabold text-brand'
const stack = 'inline-flex flex-col'
const wordmarkBase =
  'font-display font-extrabold leading-none tracking-tight text-brand'
const labelBase = 'font-semibold tracking-[0.25em] leading-none mt-1'
const labelLight = 'text-white/60'
const labelDark = 'text-gray-400'

export function NinoLogo({
  className,
  tone = 'dark',
  size = 'lg',
}: NinoLogoProps) {
  const s = sizes[size]
  const labelColor = tone === 'light' ? labelLight : labelDark

  return (
    <div className={`${root} ${className ?? ''}`}>
      <span className={`${markBase} ${s.mark}`}>
        <span className={markBg} />
        <span className={`${letterBase} ${s.letter}`}>n</span>
      </span>
      <span className={stack}>
        <span className={`${wordmarkBase} ${s.wordmark}`}>nino</span>
        <span className={`${labelBase} ${s.label} ${labelColor}`}>GESTOR</span>
      </span>
    </div>
  )
}
