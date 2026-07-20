import { Outlet } from 'react-router'

import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { SectionNav } from '@compositions/SectionNav'
import type { SectionLink } from '@compositions/SectionNav/SectionNav.types'

import styles from './Settings.module.css'

/**
 * Uma tela por assunto, não uma página infinita: cada seção tem rota
 * própria, então o link é compartilhável, o voltar do navegador funciona e
 * recarregar devolve a pessoa onde ela estava.
 */
const SECTIONS: SectionLink[] = [
  { to: 'empresa', label: 'Empresa', hint: 'CNPJ, razão social e endereço' },
  { to: 'unidade', label: 'Unidade', hint: 'Nome, link e endereço da loja' },
  {
    to: 'atendimento',
    label: 'Atendimento',
    hint: 'Canais, pagamento e pedido mínimo',
  },
  { to: 'horarios', label: 'Horários', hint: 'Quando a loja abre e fecha' },
  { to: 'entrega', label: 'Entrega', hint: 'Regiões atendidas e taxa' },
  { to: 'contato', label: 'Contato', hint: 'Telefones da loja' },
]

export const Settings = () => (
  <div className={styles.page}>
    <header className={styles.header}>
      <Eyebrow>Sua loja</Eyebrow>
      <PageTitle accent="loja">As regras da loja</PageTitle>
      <p className={styles.subtitle}>
        O que você define aqui vale na hora do pedido — no app do cliente e no
        painel.
      </p>
    </header>

    <div className={styles.columns}>
      <SectionNav sections={SECTIONS} ariaLabel="Seções das configurações" />

      <div className={styles.panel}>
        <Outlet />
      </div>
    </div>
  </div>
)
