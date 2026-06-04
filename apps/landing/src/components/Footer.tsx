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
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">nino</span>
          <p>Delivery com a sua cara, sem comissão abusiva.</p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="footer-col">
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© 2026 Nino Delivery</p>
        <p>Privacidade · Termos · Cookies</p>
      </div>
    </footer>
  )
}
