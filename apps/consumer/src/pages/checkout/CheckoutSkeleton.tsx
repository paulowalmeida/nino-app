import styles from './Checkout.module.css'

/**
 * Espelha a forma do checkout real: cabeçalho, as três seções do formulário
 * (recebimento/endereço, dados, pagamento) mais observações, e o cupom de
 * resumo. Cada tipo de campo tem seu placeholder — input, fileira de opções
 * (RadioGroup) e área de texto — pra não haver salto ao trocar pelo conteúdo.
 */
export const CheckoutSkeleton = () => (
  <div
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o checkout"
  >
    <header className={styles.header}>
      <div className={styles.skBack} />
      <div className={styles.skTitle} />
    </header>

    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skRadio}>
          <div className={styles.skPill} />
          <div className={styles.skPill} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skField} />
        <div className={styles.skRow}>
          <div className={styles.skField} />
          <div className={styles.skField} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skField} />
        <div className={styles.skField} />
      </div>

      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skRadio}>
          <div className={styles.skPill} />
          <div className={styles.skPill} />
          <div className={styles.skPill} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skTextarea} />
      </div>

      <div className={styles.skSummary}>
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryTotal} />
      </div>
    </div>
  </div>
)
