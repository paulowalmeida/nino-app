import { useLocation, useNavigate, useParams } from 'react-router'

import { Drawer } from '@nino/ds/components/Drawer'
import { NotificationsFeed } from '@shared/components/NotificationsFeed/NotificationsFeed'
import { StoreTintScope } from '@shared/components/StoreTintScope/StoreTintScope'

import styles from './StorefrontNotificationsDrawer.module.css'

const NOTIFICATIONS_PATH = '/conta/conversas'

/* WHY: a gaveta mora na URL — sino, aba do celular, menu da conta e link de
 * notificação apontam para `/conta/conversas`, e a vitrine abre por baixo.
 * Fechar devolve para a vitrine. */
export const StorefrontNotificationsDrawer = () => {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const base = slug ? `/${slug}` : ''
  const open = pathname.replace(/\/$/, '').endsWith(NOTIFICATIONS_PATH)

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (!next) void navigate(base || '/')
      }}
      placement="right"
      size="26rem"
      fullOnMobile
      title="Atualizações do pedido"
      bodyClassName={styles.storefrontNotificationsDrawerBody}
    >
      <StoreTintScope>
        <NotificationsFeed />
      </StoreTintScope>
    </Drawer>
  )
}
