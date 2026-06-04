const benefits = [
  'Cardápio ilimitado com fotos e categorias',
  'Gestão de entregadores próprios',
  'Cupons e promoções personalizadas',
  'Relatórios de vendas e clientes mais fiéis',
  'Suporte via WhatsApp em horário comercial',
]

const rates = [
  { name: 'iFood', rate: '~27%' },
  { name: 'Rappi', rate: '~30%' },
  { name: 'Aiqfome', rate: '~15%' },
]

export function ParaRestaurantes() {
  return (
    <section id="para-restaurantes" className="compare">
      <div className="compare-inner">
        <div>
          <h2>
            Chega de pagar
            <br />
            <span>30% pro iFood</span>
          </h2>
          <p className="compare-lead">
            Cada pedido que sai pelo iFood, você perde quase um terço. Com o
            Nino, esse dinheiro fica no seu bolso. Pague uma mensalidade fixa e
            venda à vontade.
          </p>
          <div className="compare-list">
            {benefits.map((benefit) => (
              <div key={benefit} className="compare-item">
                <div className="compare-check">✓</div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="compare-card">
          <div className="compare-card-head">
            <span>Plataforma</span>
            <span>Taxa por pedido</span>
          </div>
          <div className="compare-rows">
            {rates.map((item) => (
              <div key={item.name} className="compare-row">
                <span>{item.name}</span>
                <span className="rate">{item.rate}</span>
              </div>
            ))}
            <div className="compare-row nino">
              <span>Nino</span>
              <span className="rate">0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
