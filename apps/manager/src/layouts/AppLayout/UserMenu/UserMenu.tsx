import { useNavigate } from 'react-router'

import { Menu } from '@nino/ds/components/Menu'
import { NavIcon } from '@components/NavIcon'
import { PersonMark } from '@components/PersonMark'
import { logout } from '@services/auth/auth.service'
import { endSession } from '@utils/end-session'

import type { UserMenuProps } from './UserMenu.types'

import styles from './UserMenu.module.css'

/**
 * O rodapé do menu é a conta da pessoa, não da loja: aqui ficam os dados
 * dela e a assinatura da empresa — coisas que não pertencem a nenhuma
 * seção da loja aberta.
 */
export const UserMenu = ({
  name,
  tenantId,
  onNavigate,
  collapsed = false,
}: UserMenuProps) => {
  const navigate = useNavigate()

  const go = (path: string) => {
    onNavigate?.()
    void navigate(`/${tenantId}/${path}`)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // a sessão local é encerrada mesmo se a API não responder
    }
    endSession()
  }

  return (
    <Menu
      contentClassName={styles.panel}
      trigger={
        <button type="button" className={styles.trigger}>
          <PersonMark name={name} tone="night" size="sm" />
          {!collapsed && (
            <>
              <span className={styles.name}>{name.split(' ')[0]}</span>
              <NavIcon name="gear" className={styles.icon} />
            </>
          )}
        </button>
      }
      items={[
        {
          value: 'profile',
          label: 'Meus dados',
          icon: <NavIcon name="user" className={styles.itemIcon} />,
          onSelect: () => go('minha-conta'),
        },
        {
          value: 'subscription',
          label: 'Assinatura e plano',
          icon: <NavIcon name="receipt" className={styles.itemIcon} />,
          onSelect: () => go('assinatura'),
        },
        { separator: true },
        {
          value: 'logout',
          label: 'Sair da conta',
          icon: <NavIcon name="logout" className={styles.itemIcon} />,
          destructive: true,
          onSelect: () => void handleLogout(),
        },
      ]}
    />
  )
}
