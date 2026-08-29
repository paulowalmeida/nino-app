import { useNavigate } from 'react-router'

import { useTenantRole } from '@layouts/AppLayout/hooks/useTenantRole/useTenantRole'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { Tooltip } from '@nino/ds/components/Tooltip'
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
  const isOwner = useTenantRole() === 'TENANT_OWNER'

  const go = (path: string) => {
    onNavigate?.()
    void navigate(`/${tenantId}/${path}`)
  }

  return (
    <Box direction="row" className={styles.actions}>
      <Menu
        contentClassName={styles.panel}
        triggerTooltip={collapsed ? 'Abrir menu da conta' : undefined}
        trigger={
          <Button variant="ghost" className={styles.trigger}>
            <PersonMark name={name} tone="night" size="sm" />
            {!collapsed && (
              <Text as="span" className={styles.name}>
                {name.split(' ')[0]}
              </Text>
            )}
          </Button>
        }
        items={[
          {
            value: 'profile',
            label: 'Meus dados',
            icon: <Icon name="user" className={styles.itemIcon} />,
            onSelect: () => go('perfil'),
          },
          ...(isOwner
            ? [
                {
                  value: 'company',
                  label: 'Empresa',
                  icon: <Icon name="building" className={styles.itemIcon} />,
                  onSelect: () => go('empresa'),
                },
              ]
            : []),
          {
            value: 'subscription',
            label: 'Assinatura e plano',
            icon: <Icon name="receipt" className={styles.itemIcon} />,
            onSelect: () => go('assinatura'),
          },
        ]}
      />
      <Tooltip content="Sair">
        <Button
          variant="ghost"
          size="icon"
          className={styles.logout}
          aria-label="Sair da conta"
          onClick={() => void logout()}
        >
          <Icon name="logout" />
        </Button>
      </Tooltip>
    </Box>
  )
}
