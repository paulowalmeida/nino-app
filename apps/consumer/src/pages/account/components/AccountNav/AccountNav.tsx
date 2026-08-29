import { NavLink, useParams } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { ACCOUNT_SECTIONS } from '@shared/constants/account-sections'
import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { riseDelay } from '@utils/rise-delay'

import styles from './AccountNav.module.css'
import motion from '@styles/motion.module.css'

export const AccountNav = () => {
  const { slug } = useParams()
  const base = slug ? `/${slug}/conta` : '/conta'

  const { orders, addresses, logout, isLoggingOut } = useAccountFacade()
  const counts: Record<string, number | undefined> = {
    enderecos: addresses?.length,
    pedidos: orders?.length,
  }

  return (
    <Box as="nav" className={styles.nav} aria-label="Seções da conta">
      <Box as="ul" className={styles.list}>
        {ACCOUNT_SECTIONS.map(({ to, label, icon, soon }, index) => (
          <Box
            as="li"
            key={to}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(90 + index * 45)}
          >
            <NavLink
              to={`${base}/${to}`}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkOn}` : styles.link
              }
            >
              <Icon name={icon} className={styles.icon} />
              <Text as="span" className={styles.label}>
                {label}
              </Text>

              {soon ? (
                <Badge size="sm" className={styles.soon}>
                  em breve
                </Badge>
              ) : (
                counts[to] !== undefined && (
                  <Text as="span" className={styles.count}>
                    {counts[to]}
                  </Text>
                )
              )}
            </NavLink>
          </Box>
        ))}
      </Box>

      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.logout}`}
        onClick={() => logout()}
        disabled={isLoggingOut}
      >
        <Icon name="logout" className={styles.icon} />
        <Text as="span" className={styles.label}>
          {isLoggingOut ? 'Saindo…' : 'Sair da conta'}
        </Text>
      </Button>
    </Box>
  )
}
