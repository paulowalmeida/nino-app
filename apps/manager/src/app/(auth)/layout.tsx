import type { ReactNode } from 'react'

import { NinoMascot } from './_components/NinoMascot'
import styles from './layout.module.css'

import { NinoLogo } from '@/components/NinoLogo'

const shell = 'min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]'
const brandPanel = `${styles.dotGrid} ${styles.grain} relative hidden overflow-hidden bg-dark lg:flex lg:flex-col lg:justify-between lg:p-12`
const glowTop = `${styles.glowPulse} pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-3xl`
const glowBottom =
  'pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl'
const brandLogo = 'relative z-10'
const mascotWrap = 'relative z-10 flex flex-1 items-center justify-center py-10'
const mascotStage = 'relative h-96 w-96'
const mascotHalo = 'absolute inset-6 rounded-full bg-white/5 backdrop-blur-sm'
const mascot = `${styles.mascotFloat} relative h-full w-full drop-shadow-2xl`
const tagline = 'relative z-10 max-w-lg'
const taglineTitle =
  'font-display text-5xl font-extrabold leading-tight text-white'
const taglineAccent = styles.highlight
const taglineText = 'mt-3 text-lg leading-relaxed text-white/60'
const formPanel = `${styles.warmBackdrop} ${styles.grain} relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12`
const formGlow =
  'pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-brand/15 blur-3xl lg:hidden'
const formInner =
  'relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/75 p-8 shadow-2xl shadow-brand/10 backdrop-blur-md sm:p-10'
const mobileLogo = 'mb-10 flex justify-center lg:hidden'

export default function AuthLayout({ children }: { children: ReactNode }) {
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
            Pedidos, cardápio, vendas e faturamento — tudo num só lugar.
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
