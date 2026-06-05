import { Fragment } from 'react'

import styles from './Precos.module.css'

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
    <section id="precos" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Planos e preços</span>
          <h2 className={styles.title}>Preço simples, resultado real</h2>
          <p className={styles.lead}>
            Sem taxa por pedido. Sem percentual sobre venda. Sem letras miúdas.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan) => (
            <div
              key={plan.tag}
              className={`${styles.plan} ${plan.featured ? styles.featured : ''}`}
            >
              {plan.featured && (
                <span className={styles.badge}>MAIS POPULAR</span>
              )}
              <p className={styles.tag}>{plan.tag}</p>
              <div
                className={`${styles.price} ${plan.small ? styles.priceSmall : ''}`}
              >
                {plan.price.split('\n').map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
                {plan.period && (
                  <span className={styles.period}>{plan.period}</span>
                )}
              </div>
              <p className={styles.desc}>{plan.desc}</p>
              <div className={styles.features}>
                {plan.features.map((feature) => (
                  <span key={feature} className={styles.feature}>
                    {feature}
                  </span>
                ))}
              </div>
              <a className={styles.btn} href={CADASTRO_URL}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className={styles.fine}>
          🔒 30 dias grátis nos planos Básico, Padrão e Pro. Sem cartão de
          crédito.
        </p>
      </div>
    </section>
  )
}
