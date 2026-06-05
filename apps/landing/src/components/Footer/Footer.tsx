import styles from './Footer.module.css'

import { CADASTRO_URL } from '@/config'

const columns = [
  {
    title: 'Produto',
    links: [
      { label: 'Como funciona', href: '#como-funciona' },
      { label: 'Demonstração', href: '#demo' },
      { label: 'Preços', href: '#precos' },
      { label: 'Criar minha loja', href: CADASTRO_URL },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Cases', href: '#' },
      { label: 'Contato', href: '#' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', href: '#' },
      { label: 'WhatsApp', href: '#' },
      { label: 'Status do sistema', href: '#' },
      { label: 'Termos de uso', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              nino<i>.</i>
            </span>
            <p className={styles.tagline}>
              Delivery com a sua cara, sem comissão abusiva.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className={styles.col}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Nino Delivery</p>
          <p>Privacidade · Termos · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
