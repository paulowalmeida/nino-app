import styles from './ComoFunciona.module.css'

const steps = [
  {
    title: 'Configure sua loja',
    text: 'Cadastre cardápio, área de entrega e formas de pagamento. A gente cuida do resto — em até 48h você está no ar.',
  },
  {
    title: 'Deixe com a sua cara',
    text: 'Logo, cores e domínio próprio. App e site completos com a SUA marca — seus clientes nunca veem o nome Nino.',
  },
  {
    title: 'Venda no automático',
    text: 'Pedidos chegam pelo app, site e WhatsApp num lugar só. Seus entregadores, 100% da sua margem.',
  },
]

export function ComoFunciona() {
  return (
    <section id="como-funciona" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Simples assim</span>
          <h2 className={styles.title}>Como o Nino funciona</h2>
          <p className={styles.subtitle}>
            Do cadastro ao primeiro pedido em 3 passos.
          </p>
        </div>

        <div className={styles.track}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.num}>{index + 1}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
