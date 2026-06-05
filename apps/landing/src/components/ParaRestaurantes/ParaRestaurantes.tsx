import styles from './ParaRestaurantes.module.css'

const benefits = [
  'Personalize seu endereço web e site com a sua marca — não só um cardápio',
  'Gerencie seus entregadores e colaboradores, do seu jeito',
  'Independente — sua base de clientes é sua, não de um marketplace',
  'Pedidos pelo app, site e WhatsApp num lugar só',
  'Mensalidade fixa — sem comissão, sem % do seu faturamento',
]

const billing = [
  { name: 'Anota AI', model: 'R$300–400/mês' },
  { name: 'Brendi', model: '4% do faturamento' },
  { name: 'Cardápio Web', model: 'Mensal + módulos pagos' },
  { name: 'Goomer', model: 'Limita a 30 pedidos/mês' },
  { name: 'Wabiz', model: 'Preço só sob demanda' },
]

export function ParaRestaurantes() {
  return (
    <section id="para-restaurantes" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <span className={styles.eyebrow}>O Nino vs o mercado</span>
          <h2 className={styles.title}>
            Mais completo.{' '}
            <span className={styles.titleAccent}>Mais justo.</span>
          </h2>
          <p className={styles.lead}>
            Os outros cobram por pedido, por loja extra ou uma fatia do seu
            faturamento. No Nino a mensalidade é fixa por plano — com app, site,
            WhatsApp e os seus entregadores no mesmo pacote.
          </p>
          <div className={styles.list}>
            {benefits.map((benefit) => (
              <div key={benefit} className={styles.item}>
                <span className={styles.check}>✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span>Plataforma</span>
            <span>Como cobram</span>
          </div>
          {billing.map((item) => (
            <div key={item.name} className={styles.row}>
              <span>{item.name}</span>
              <span className={styles.rate}>{item.model}</span>
            </div>
          ))}
          <div className={`${styles.row} ${styles.nino}`}>
            <span className={styles.ninoName}>Nino</span>
            <span className={styles.rate}>Fixo · Sem comissão</span>
          </div>
        </div>
      </div>
    </section>
  )
}
