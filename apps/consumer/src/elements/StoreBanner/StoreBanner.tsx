import styles from './StoreBanner.module.css'

type StoreBannerProps = {
  logoUrl?: string | null
  className?: string
}

/**
 * A faixa da loja sangra de ponta a ponta: é a primeira coisa que diz onde a
 * pessoa está, e uma capa emoldurada não diz isso. Ela desenrola de cima
 * para baixo — o mesmo gesto de comanda saindo da impressora que abre as
 * telas do gestor.
 */
export const StoreBanner = ({ logoUrl, className }: StoreBannerProps) => (
  <div className={`${styles.banner} ${className ?? ''}`}>
    {logoUrl && <img src={logoUrl} alt="" className={styles.mark} />}
    <div className={styles.scrim} />
  </div>
)
