const steps = [
  {
    tone: 'warm',
    title: 'Configure sua loja',
    text: 'Cadastre cardápio, área de entrega e formas de pagamento. A gente cuida do resto — em até 48h você está no ar.',
  },
  {
    tone: 'accent',
    title: 'Deixe com a sua cara',
    text: 'Logo, cores e domínio próprio. App e site completos com a SUA marca — seus clientes nunca veem o nome Nino.',
  },
  {
    tone: 'dark',
    title: 'Venda no automático',
    text: 'Pedidos chegam pelo app, site e WhatsApp num lugar só. Seus entregadores, 100% da sua margem.',
  },
]

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="how">
      <div className="how-inner">
        <div className="how-header">
          <h2>Como o Nino funciona</h2>
          <p>Do cadastro ao primeiro pedido em 3 passos.</p>
        </div>
        <div className="how-grid">
          <div className="how-line" />
          {steps.map((step, index) => (
            <div key={step.title} className="how-step">
              <div className={`how-num ${step.tone}`}>{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
