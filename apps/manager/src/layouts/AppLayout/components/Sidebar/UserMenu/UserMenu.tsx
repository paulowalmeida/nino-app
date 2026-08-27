import { useNavigate } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import { useLogout } from '@shared/hooks/session/useLogout/useLogout'

import styles from './UserMenu.module.css'

type UserMenuProps = {
  name: string
  tenantId: string | null
  onNavigate?: () => void
  collapsed?: boolean
}

export const UserMenu = ({
  name,
  tenantId,
  onNavigate,
  collapsed = false,
}: UserMenuProps) => {
  const navigate = useNavigate()
  const { logout } = useLogout()

  const go = (path: string) => {
    onNavigate?.()
    void navigate(`/${tenantId}/${path}`)
  }

  return (
    <Menu
      contentClassName={styles.panel}
      trigger={
        <Button variant="ghost" className={styles.trigger}>
          <PersonMark name={name} tone="night" size="sm" />
          {!collapsed && (
            <>
              <Text as="span" className={styles.name}>
                {name.split(' ')[0]}
              </Text>
              <Icon name="settings" className={styles.icon} />
            </>
          )}
        </Button>
      }
      items={[
        {
          value: 'profile',
          label: 'Meus dados',
          icon: <Icon name="user" className={styles.itemIcon} />,
          onSelect: () => go('profile'),
        },
        {
          value: 'subscription',
          label: 'Assinatura e plano',
          icon: <Icon name="receipt" className={styles.itemIcon} />,
          onSelect: () => go('assinatura'),
        },
        { separator: true },
        {
          value: 'logout',
          label: 'Sair da conta',
          icon: <Icon name="logout" className={styles.itemIcon} />,
          destructive: true,
          onSelect: () => void logout(),
        },
      ]}
    />
  )
}
