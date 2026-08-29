import { useNavigate } from 'react-router'

import { Menu } from '@nino/ds/components/Menu'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import { Button } from '@nino/ds/components/Button'
import {
  useCustomerSession,
} from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { displayName, storeInitials } from '@utils/store-info'
import { formatPhone } from '@utils/phone'
import type { Store } from '@custom_types/store/store'

import styles from './StoreTopBar.module.css'

type StoreTopBarProps = {
  store: Store
  slug: string
  cartCount: number
  onCart: () => void
  /** 0 no topo da página, 1 com a transição do cabeçalho concluída. */
  progress: number
  searchable: boolean
  search: string
  onSearchChange: (value: string) => void
}

/**
 * A faixa que não sai da tela: identidade da loja à esquerda, sacola e conta
 * à direita.
 *
 * A conta abre um menu, não uma página. Quem quer ver os pedidos não deveria
 * ter que entrar num perfil e procurar a aba — os destinos são atalhos aqui, e
 * a tela de perfil com menu lateral só aparece depois que a pessoa escolhe um
 * deles.
 */
export const StoreTopBar = ({
  store,
  slug,
  cartCount,
  onCart,
  progress,
  searchable,
  search,
  onSearchChange,
}: StoreTopBarProps) => {
  const navigate = useNavigate()
  const { customer } = useCustomerSession()
  const logout = useLogout()

  const base = slug ? `/${slug}` : ''
  const go = (path: string) => () => void navigate(`${base}${path}`)

  const named = customer?.profileCompletedAt
    ? customer.name
    : formatPhone(customer?.phone ?? '')

  return (
    <header
      className={styles.bar}
      style={{ '--p': progress } as React.CSSProperties}
    >
      <div className={styles.inner}>
        {/*
         * A logo aqui é a outra ponta do azulejo grande do banner: enquanto
         * ele encolhe e some ao rolar, esta cresce e aparece na mesma margem
         * esquerda. A pessoa lê como uma peça só, que se acomodou no topo.
         */}
        <a href={base || '/'} className={styles.brand}>
          <span className={styles.logo}>
            <Image
              src={store.logoUrl}
              alt=""
              className={styles.logoImg}
              placeholder={storeInitials(store)}
            />
          </span>
          <span className={styles.storeName}>{displayName(store)}</span>
        </a>

        {/* a busca não sai de cena: ela migra da página para o topo, e quem
            rolou até o fim do cardápio não precisa voltar para procurar */}
        {searchable && (
          <div className={styles.search}>
            <Icon name="search" className={styles.searchIcon} />
            <Input
              type="search"
              aria-label="Buscar no cardápio"
              placeholder="Buscar no cardápio"
              className={styles.searchInput}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        )}

        <div className={styles.tools}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.iconBtn}
            onClick={onCart}
            aria-label={`Sacola com ${cartCount} ${
              cartCount === 1 ? 'item' : 'itens'
            }`}
          >
            <Icon name="bag" />
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </Button>

          {customer ? (
            <Menu
              contentClassName={styles.menuPanel}
              trigger={
                <Button
                  variant="ghost"
                  className={styles.account}
                  aria-label={`Sua conta — ${named}`}
                >
                  <Icon name="user" />
                  <span className={styles.accountName}>{named}</span>
                </Button>
              }
              items={[
                {
                  value: 'orders',
                  label: 'Pedidos',
                  icon: <Icon name="bag" />,
                  onSelect: go('/conta/pedidos'),
                },
                {
                  value: 'addresses',
                  label: 'Endereços',
                  icon: <Icon name="map-pin" />,
                  onSelect: go('/conta/enderecos'),
                },
                {
                  value: 'payment',
                  label: 'Pagamento',
                  icon: <Icon name="credit-card" />,
                  onSelect: go('/conta/pagamento'),
                },
                {
                  value: 'profile',
                  label: 'Meus dados',
                  icon: <Icon name="user" />,
                  onSelect: go('/conta/dados'),
                },
                { separator: true },
                {
                  value: 'logout',
                  label: 'Sair',
                  icon: <Icon name="logout" />,
                  destructive: true,
                  onSelect: () => logout.mutate(),
                },
              ]}
            />
          ) : (
            <Button
              variant="ghost"
              className={styles.signIn}
              onClick={go('/entrar')}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
