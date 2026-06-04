const features = [
  {
    icon: '🏪',
    title: 'Sua marca, sempre',
    text: 'App e site com a identidade visual do seu restaurante. Seus clientes nunca vão ver o nome de outra plataforma.',
  },
  {
    icon: '💳',
    title: 'Zero comissão',
    text: 'Pague uma mensalidade fixa e fique com 100% do valor dos seus pedidos. Sem surpresas.',
  },
  {
    icon: '📊',
    title: 'Dashboard completo',
    text: 'Acompanhe pedidos, faturamento e desempenho em tempo real de qualquer dispositivo.',
  },
  {
    icon: '🗺️',
    title: 'Rastreamento live',
    text: 'Seus clientes acompanham o entregador em tempo real. Menos ligações, mais satisfação.',
  },
  {
    icon: '🔔',
    title: 'Notificações inteligentes',
    text: 'Push, WhatsApp e SMS automáticos em cada etapa do pedido.',
  },
  {
    icon: '⚡',
    title: '48h pra lançar',
    text: 'Da contratação ao primeiro pedido em até 48 horas. A gente cuida de toda a configuração inicial.',
  },
]

export function Features() {
  return (
    <section className="features">
      <div className="features-header">
        <h2>
          Tudo que você precisa,
          <br />
          <span>nada que te atrapalha</span>
        </h2>
        <p>O Nino cuida da tecnologia. Você cuida da comida.</p>
      </div>
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
