import type { IconName } from '@nino/ds/components/Icon'

type AccountNavigationItem = {
  value: string
  section: string
  label: string
  icon: IconName
  ownerOnly?: boolean
}

export const ACCOUNT_NAVIGATION_ITEMS: AccountNavigationItem[] = [
  {
    value: 'profile',
    section: 'perfil',
    label: 'Meu perfil',
    icon: 'user',
  },
  {
    value: 'notifications',
    section: 'notificacoes',
    label: 'Notificações',
    icon: 'bell',
  },
  {
    value: 'subscription',
    section: 'assinatura',
    label: 'Assinatura e plano',
    icon: 'receipt',
    ownerOnly: true,
  },
]
