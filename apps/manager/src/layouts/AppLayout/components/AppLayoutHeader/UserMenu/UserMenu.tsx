import { useNavigate } from 'react-router'

import { useUnitRole } from '@layouts/AppLayout/hooks/useUnitRole/useUnitRole'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import { useLogout } from '@shared/hooks/session/useLogout/useLogout'

import styles from './UserMenu.module.css'

type UserMenuProps = {
  name: string
  email?: string
  positionName?: string
  unitName?: string
  unitId: string | null
}

export const UserMenu = ({
  name,
  email,
  positionName,
  unitName,
  unitId,
}: UserMenuProps) => {
  const navigate = useNavigate()
  const { logout } = useLogout()
  const isOwner = useUnitRole() === 'UNIT_OWNER'

  const go = (path: string) => void navigate(`/${unitId}/${path}`)
  const membershipLine = [positionName, unitName].filter(Boolean).join(' · ')

  return (
    <Menu
      placement="bottom-end"
      contentClassName={styles.userMenuPanel}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className={styles.userMenuTrigger}
          aria-label="Abrir menu da conta"
        >
          <PersonMark name={name} tone="night" size="sm" />
        </Button>
      }
      header={
        <Box direction="column" className={styles.identity}>
          <Text as="span" className={styles.name}>
            {name}
          </Text>
          {email && (
            <Text as="span" className={styles.detail}>
              {email}
            </Text>
          )}
          {membershipLine && (
            <Text as="span" className={styles.detail}>
              {membershipLine}
            </Text>
          )}
        </Box>
      }
      items={[
        { separator: true },
        {
          value: 'profile',
          label: 'Meu perfil',
          icon: <Icon name="user" className={styles.itemIcon} />,
          onSelect: () => go('perfil'),
        },
        {
          value: 'notifications',
          label: 'Notificações',
          icon: <Icon name="bell" className={styles.itemIcon} />,
          onSelect: () => go('notificacoes'),
        },
        ...(isOwner
          ? [
              {
                value: 'subscription',
                label: 'Assinatura e plano',
                icon: <Icon name="receipt" className={styles.itemIcon} />,
                onSelect: () => go('assinatura'),
              },
            ]
          : []),
        { separator: true },
        {
          value: 'logout',
          label: 'Sair',
          icon: <Icon name="logout" className={styles.itemIcon} />,
          onSelect: () => void logout(),
        },
      ]}
    />
  )
}
