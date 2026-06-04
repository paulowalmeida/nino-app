const steps = [
  {
    tone: 'warm',
    title: 'Cadastre seu negócio',
    text: 'Preencha os dados do restaurante, cardápio e área de entrega. Leva menos de 20 minutos.',
  },
  {
    tone: 'accent',
    title: 'Personalize sua marca',
    text: 'Logo, cores e nome. Seu app fica com a cara do seu restaurante, não do Nino.',
  },
  {
    tone: 'dark',
    title: 'Receba pedidos',
    text: 'Compartilhe o link com seus clientes e comece a vender. Sem comissão, sem intermediário.',
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
