'use client'

import Image from 'next/image'

import { CADASTRO_URL } from '@/config'

const stats = [
  { value: '0%', label: 'de comissão' },
  { value: '48h', label: 'pra estar no ar' },
  { value: '100%', label: 'da sua marca' },
]

const chips = [
  { className: 'top-left', emoji: '🚀', text: 'Pedido entregue!' },
  { className: 'top-right', emoji: '⭐', text: '4.9 avaliação' },
  { className: 'bottom-right', emoji: '💰', text: 'R$ 0 de comissão' },
]

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Seu delivery,
          <br />
          sua <span>marca.</span>
        </h1>
        <p>
          O Nino transforma qualquer restaurante em uma plataforma de delivery
          completa. Sem comissão abusiva, sem dividir sua marca com ninguém.
        </p>
        <div className="hero-cta">
          <a className="btn-primary border-none" href={CADASTRO_URL}>
            Criar minha loja
          </a>
          <button className="btn-secondary" onClick={scrollToDemo}>
            Ver demonstração →
          </button>
        </div>
        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="mascot-container">
          <div className="mascot-bg" />
          <div className="mascot-svg">
            <Image
              src="/mascot.svg"
              alt="Mascote Nino entregando um pedido"
              width={300}
              height={300}
              className="mascot-img"
              priority
            />
          </div>

          {chips.map((chip) => (
            <div key={chip.className} className={`float-chip ${chip.className}`}>
              {chip.emoji} <span>{chip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
