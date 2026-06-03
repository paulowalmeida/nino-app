import type { ReactNode } from 'react'

import { NinoLogo } from './NinoLogo'
import { NinoMascot } from './NinoMascot'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="auth-grid relative hidden overflow-hidden bg-dark lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="auth-glow pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative z-10">
          <NinoLogo tone="light" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-10">
          <div className="relative h-80 w-80">
            <div className="absolute inset-6 rounded-full bg-white/5 backdrop-blur-sm" />
            <NinoMascot className="auth-mascot relative h-full w-full drop-shadow-2xl" />
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white">
            Gerencie sua loja,
            <br />
            <span className="text-brand">do seu jeito.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Pedidos, cardápio e configurações num só lugar. Sem comissão
            abusiva, com a sua marca no comando.
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-brand/10 blur-3xl lg:hidden" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-10 flex justify-center lg:hidden">
            <NinoLogo />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
