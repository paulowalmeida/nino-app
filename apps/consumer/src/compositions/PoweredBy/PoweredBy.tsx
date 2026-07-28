import styles from './PoweredBy.module.css'

const LANDING_URL = 'https://dev.nino.delivery'

/**
 * A assinatura do nino no rodapé da loja.
 *
 * É o laço de crescimento do produto: quem pede comida aqui é a mesma pessoa
 * que pode ter um balcão do outro lado, e este é o único lugar onde o nino
 * fala com o cliente do cliente. Discreta de propósito — a loja é a marca da
 * tela; o nino é o rodapé dela.
 *
 * "feito com" e não "powered by": o inglês é o padrão do mercado e não estaria
 * errado (quer dizer "a tecnologia por trás", não autoria), mas esta tela é
 * toda em português e falada para quem só quer jantar. Trocar de idioma no
 * rodapé é pedir uma tradução mental por uma convenção de SaaS.
 */
export const PoweredBy = () => (
  <footer className={styles.footer}>
    <a
      href={LANDING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      powered by <span className={styles.mark}>nino</span>
    </a>
  </footer>
)
