import styles from './Features.module.css'

const features = [
  {
    num: '01',
    icon: '🏪',
    title: 'Sua marca, sempre',
    text: 'App e site com a identidade visual do seu restaurante. Seus clientes nunca vão ver o nome de outra plataforma.',
  },
  {
    num: '02',
    icon: '💳',
    title: 'Zero comissão',
    text: 'Pague uma mensalidade fixa e fique com 100% do valor dos seus pedidos. Sem surpresas, sem taxa por pedido.',
    featured: true,
    tag: 'O diferencial',
  },
  {
    num: '03',
    icon: '📊',
    title: 'Dashboard completo',
    text: 'Acompanhe pedidos, faturamento e desempenho em tempo real de qualquer dispositivo.',
  },
  {
    num: '04',
    icon: '🗺️',
    title: 'Rastreamento live',
    text: 'Seus clientes acompanham o entregador em tempo real. Menos ligações, mais satisfação.',
  },
  {
    num: '05',
    icon: '🔔',
    title: 'Notificações inteligentes',
    text: 'Push, WhatsApp e SMS automáticos em cada etapa do pedido.',
  },
  {
    num: '06',
    icon: '⚡',
    title: '48h pra lançar',
    text: 'Da contratação ao primeiro pedido em até 48 horas. A gente cuida de toda a configuração inicial.',
  },
]

export function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Plataforma completa</span>
          <h2 className={styles.title}>
            Tudo que você precisa,{' '}
            <span className={styles.titleAccent}>nada que te atrapalha</span>
          </h2>
          <p className={styles.subtitle}>
            O Nino cuida da tecnologia. Você cuida da comida.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`${styles.card} ${feature.featured ? styles.featured : ''}`}
            >
              <span className={styles.number}>{feature.num}</span>
              <span className={styles.icon}>{feature.icon}</span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.text}</p>
              {feature.tag && (
                <span className={styles.tag}>★ {feature.tag}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
