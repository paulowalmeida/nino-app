import { Fragment } from 'react'

import { CADASTRO_URL } from '@/config'

const plans = [
  {
    tag: 'Básico',
    price: 'R$89,90',
    period: '/mês',
    small: false,
    desc: 'Pra quem está começando o delivery próprio.',
    features: [
      '400 vendas por mês',
      'Site próprio com cardápio e pedidos',
      'WhatsApp bot que atende sozinho',
      'Gestão de entregadores',
      'Suporte por email (até 24h úteis)',
    ],
    cta: 'Criar minha loja',
    featured: false,
  },
  {
    tag: 'Padrão',
    price: 'R$199',
    period: '/mês',
    small: false,
    desc: 'Pra crescer com a sua própria marca.',
    features: [
      'Tudo do Básico',
      'Vendas ilimitadas',
      'App mobile próprio',
      'Domínio próprio',
      'Relatórios e fidelidade',
      'Suporte por WhatsApp',
    ],
    cta: 'Criar minha loja',
    featured: true,
  },
  {
    tag: 'Pro',
    price: 'R$299',
    period: '/mês',
    small: false,
    desc: 'Pra escalar e operar várias lojas.',
    features: [
      'Tudo do Padrão',
      'Multi-loja',
      'Integrações (PDV e fiscal)',
      'Suporte prioritário',
    ],
    cta: 'Criar minha loja',
    featured: false,
  },
  {
    tag: 'Custom',
    price: 'Sob\nconsulta',
    period: '',
    small: true,
    desc: 'Pra redes e franquias com alto volume.',
    features: [
      'Lojas ilimitadas',
      'Gerente de conta dedicado',
      'SLA garantido',
    ],
    cta: 'Falar com vendas',
    featured: false,
  },
]

export function Precos() {
  return (
    <section id="precos" className="pricing">
      <div className="pricing-inner">
        <div className="pricing-head">
          <h2>
            Preço simples,
            <br />
            resultado real
          </h2>
          <p className="pricing-lead">
            Sem taxa por pedido. Sem percentual sobre venda. Sem letras miúdas.
          </p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.tag}
              className={`plan${plan.featured ? ' featured' : ''}`}
            >
              {plan.featured && <div className="plan-badge">MAIS POPULAR</div>}
              <p className="plan-tag">{plan.tag}</p>
              <div className={`plan-price${plan.small ? ' small' : ''}`}>
                {plan.price.split('\n').map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                {plan.period && <span>{plan.period}</span>}
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-features">
                {plan.features.map((feature) => (
                  <div key={feature}>✓ {feature}</div>
                ))}
              </div>
              <a
                className={`plan-btn${plan.featured ? ' featured' : ''}`}
                href={CADASTRO_URL}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="pricing-fine">
          🔒 30 dias grátis nos planos Básico, Padrão e Pro. Sem cartão de
          crédito.
        </p>
      </div>
    </section>
  )
}
