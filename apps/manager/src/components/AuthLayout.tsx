import type { ReactNode } from 'react'

import { NinoLogo } from './NinoLogo'
import { NinoMascot } from './NinoMascot'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const shell = 'min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]'
  const brandPanel =
    'auth-grid relative hidden overflow-hidden bg-dark lg:flex lg:flex-col lg:justify-between lg:p-12'
  const glowTop =
    'auth-glow pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-3xl'
  const glowBottom =
    'pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl'
  const brandLogo = 'relative z-10'
  const mascotWrap =
    'relative z-10 flex flex-1 items-center justify-center py-10'
  const mascotStage = 'relative h-80 w-80'
  const mascotHalo = 'absolute inset-6 rounded-full bg-white/5 backdrop-blur-sm'
  const mascot = 'auth-mascot relative h-full w-full drop-shadow-2xl'
  const tagline = 'relative z-10 max-w-md'
  const taglineTitle =
    'font-display text-3xl font-extrabold leading-tight text-white'
  const taglineAccent = 'text-brand'
  const taglineText = 'mt-3 text-sm leading-relaxed text-white/60'
  const formPanel =
    'relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12'
  const formGlow =
    'pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-brand/10 blur-3xl lg:hidden'
  const formInner = 'relative z-10 w-full max-w-sm'
  const mobileLogo = 'mb-10 flex justify-center lg:hidden'
  
  return (
    <div className={shell}>
      <aside className={brandPanel}>
        <div className={glowTop} />
        <div className={glowBottom} />

        <div className={brandLogo}>
          <NinoLogo tone="light" />
        </div>

        <div className={mascotWrap}>
          <div className={mascotStage}>
            <div className={mascotHalo} />
            <NinoMascot className={mascot} />
          </div>
        </div>

        <div className={tagline}>
          <h2 className={taglineTitle}>
            Gerencie sua loja,
            <br />
            <span className={taglineAccent}>do seu jeito.</span>
          </h2>
          <p className={taglineText}>
            Pedidos, cardápio e configurações num só lugar. Sem comissão
            abusiva, com a sua marca no comando.
          </p>
        </div>
      </aside>

      <main className={formPanel}>
        <div className={formGlow} />
        <div className={formInner}>
          <div className={mobileLogo}>
            <NinoLogo />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
