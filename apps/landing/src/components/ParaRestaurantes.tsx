const benefits = [
  'App e site próprios com a sua marca — não só um cardápio',
  'Seus entregadores na sua operação, do seu jeito',
  'Multi-loja sem taxa por unidade extra',
  'Pedidos pelo app, site e WhatsApp num lugar só',
  'Mensalidade fixa — sem comissão, sem % do seu faturamento',
]

const billing = [
  { name: 'iFood', model: '12–23% por pedido' },
  { name: 'Anota AI', model: '+R$30 por loja' },
  { name: 'Brendi', model: '4% do faturamento' },
]

export function ParaRestaurantes() {
  return (
    <section id="para-restaurantes" className="compare">
      <div className="compare-inner">
        <div>
          <h2>
            Mais completo.
            <br />
            <span>Mais justo.</span>
          </h2>
          <p className="compare-lead">
            Os outros cobram por pedido, por loja extra ou uma fatia do seu
            faturamento. O Nino é uma mensalidade fixa — com app, site, WhatsApp
            e os seus entregadores no mesmo pacote.
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
            <span>Como cobram</span>
          </div>
          <div className="compare-rows">
            {billing.map((item) => (
              <div key={item.name} className="compare-row">
                <span>{item.name}</span>
                <span className="rate">{item.model}</span>
              </div>
            ))}
            <div className="compare-row nino">
              <span>Nino</span>
              <span className="rate">Fixo · tudo incluso</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
