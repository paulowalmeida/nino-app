import { Outlet } from 'react-router'

import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { SectionNav } from '@compositions/SectionNav'
import { SETTINGS_SECTIONS } from '@constants/settings-sections'

import styles from './Settings.module.css'


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
      <div className={styles.index}>
        <SectionNav sections={SETTINGS_SECTIONS} ariaLabel="Seções das configurações" />
      </div>

      <div className={styles.panel}>
        <Outlet />
      </div>
    </div>
  </div>
)
