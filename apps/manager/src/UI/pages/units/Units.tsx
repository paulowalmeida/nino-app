import { useCallback, useState } from 'react'
import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { BrandTopBar } from '@molecules/BrandTopBar/BrandTopBar'
import { FirstStoreForm } from '@organisms/FirstStoreForm/FirstStoreForm'
import { StorePreview } from '@organisms/StorePreview/StorePreview'
import { useLogout } from '@hooks/session/useLogout'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Units.module.css'

export const Units = () => {
  const user = useSessionStore((state) => state.user)
  const { logout } = useLogout()
  const [storeName, setStoreName] = useState('')

  const firstName = user?.name?.split(' ')[0]
  const title = firstName
    ? `Sua primeira loja, ${firstName}`
    : 'Sua primeira loja'

  const handleFormChange = useCallback(
    (values: { customName?: string }) => setStoreName(values.customName ?? ''),
    []
  )

  return (
    <div className={styles.shell}>
      <BrandTopBar actionLabel="Sair" onAction={() => void logout()} />

      <main className={styles.page}>
        <Box direction="row" wrap align="end" justify="between" gap={3}>
          <div>
            <p className={styles.eyebrow}>Unidades</p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>
              Cada unidade tem cardápio, horário e zonas próprios. A empresa e a
              assinatura ficam por cima de todas.
            </p>
          </div>

          <Link to="/boas-vindas" className={styles.guideAgain}>
            Ver como funciona
          </Link>
        </Box>

        <div className={styles.preview}>
          <StorePreview name={storeName} />
        </div>

        <div className={styles.form}>
          <FirstStoreForm onChange={handleFormChange} submitLabel="Criar loja" />
        </div>
      </main>
    </div>
  )
}
