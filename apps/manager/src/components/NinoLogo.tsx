type NinoLogoProps = {
  className?: string
  tone?: 'light' | 'dark'
}

const wordmark = 'font-display text-2xl font-extrabold leading-none tracking-tight'
const label = 'text-[10px] font-semibold tracking-[0.25em] leading-none mt-1'

export function NinoLogo({ className, tone = 'dark' }: NinoLogoProps) {
  const labelColor = tone === 'light' ? 'text-white/60' : 'text-gray-400'

  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-brand/15" />
        <span className="font-display text-xl font-extrabold text-brand">
          n
        </span>
      </span>
      <span className="inline-flex flex-col">
        <span className={`${wordmark} text-brand`}>nino</span>
        <span className={`${label} ${labelColor}`}>GESTOR</span>
      </span>
    </div>
  )
}
