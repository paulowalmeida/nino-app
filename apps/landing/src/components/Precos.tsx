import { Fragment } from 'react'

import { CADASTRO_URL } from '@/config'

const plans = [
  {
    tag: 'Iniciante',
    price: 'R$97',
    period: '/mês',
    small: false,
    desc: 'Ideal pra quem tá começando no delivery próprio.',
    features: [
      'Até 200 pedidos/mês',
      '1 unidade',
      'App + site próprio',
      'Suporte por email',
    ],
    cta: 'Criar minha loja',
    featured: false,
  },
  {
    tag: 'Profissional',
    price: 'R$197',
    period: '/mês',
    small: false,
    desc: 'Pra quem quer crescer de verdade.',
    features: [
      'Pedidos ilimitados',
      'Até 3 unidades',
      'App + site + QR Code',
      'Cupons e fidelidade',
      'Suporte WhatsApp',
    ],
    cta: 'Criar minha loja',
    featured: true,
  },
  {
    tag: 'Rede',
    price: 'Sob\nconsulta',
    period: '',
    small: true,
    desc: 'Para redes com 4+ unidades e volume alto.',
    features: [
      'Unidades ilimitadas',
      'API e integrações',
      'Gerente de conta dedicado',
      'SLA garantido',
    ],
    cta: 'Começar agora',
    featured: false,
  },
]

export function Precos() {
  return (
    <section id="precos" className="pricing">
      <div className="pricing-inner">
        <h2>
          Preço simples,
          <br />
          resultado real
        </h2>
        <p className="pricing-lead">
          Sem taxa por pedido. Sem percentual sobre venda. Sem letras miúdas.
        </p>
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
          🔒 30 dias grátis em todos os planos. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
