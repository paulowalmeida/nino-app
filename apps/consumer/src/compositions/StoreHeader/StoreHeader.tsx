import { useEffect, useRef, useState } from 'react'

import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import searchIcon from '@assets/icons/search.svg?raw'
import { Icon } from '@components/Icon/Icon'
import { AccountButton } from '@compositions/AccountButton/AccountButton'
import { displayName, initials, isOpen } from '@utils/store-info'

import type { StoreHeaderProps } from './StoreHeader.types'

import styles from './StoreHeader.module.css'

/**
 * O rosto da loja: logo em azulejo, nome em corpo justo e, logo abaixo, a
 * resposta de quem chega com fome — está aberto? em quanto tempo chega? A lupa
 * abre um campo de busca por produto sem roubar espaço fixo do topo.
 */
export const StoreHeader = ({
  store,
  slug,
  hours,
  estimatedMinutes,
  searchable,
  search,
  onSearchChange,
}: StoreHeaderProps) => {
  const open = isOpen(store, hours)
  const [searchOpen, setSearchOpen] = useState(() => search.trim().length > 0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const closeSearch = (): void => {
    onSearchChange('')
    setSearchOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image
              src={store.logoUrl}
              alt=""
              className={styles.logoImg}
              placeholder={
                <span className={styles.logoFallback}>{initials(store)}</span>
              }
            />
          </div>

          <div className={styles.identity}>
            <h1 className={styles.name}>{displayName(store)}</h1>
            <p className={open ? styles.meta : styles.metaClosed}>
              <span
                className={open ? `${styles.dot} ${styles.dotOn}` : styles.dot}
                aria-hidden="true"
              />
              {open ? 'Aberto agora' : 'Fechado'}
              {open && estimatedMinutes ? (
                <span className={styles.time}>
                  ~{estimatedMinutes} min
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className={styles.tools}>
          {searchable ? (
            <button
              type="button"
              className={styles.searchToggle}
              aria-label={searchOpen ? 'Fechar busca' : 'Buscar no cardápio'}
              aria-expanded={searchOpen}
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            >
              <span className={styles.searchToggleIconStack}>
                <Icon
                  svg={searchIcon}
                  className={`${styles.searchToggleIcon} ${
                    searchOpen ? styles.searchToggleIconHidden : ''
                  }`}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`${styles.searchToggleIcon} ${
                    searchOpen ? '' : styles.searchToggleIconHidden
                  }`}
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
          ) : null}

          <AccountButton slug={slug} />
        </div>
      </div>

      {searchable ? (
        <div
          className={`${styles.searchRow} ${
            searchOpen ? styles.searchRowOpen : ''
          }`}
        >
          <div className={styles.searchRowInner}>
            <div className={styles.searchField}>
              <Icon svg={searchIcon} className={styles.searchFieldIcon} />
              <Input
                ref={inputRef}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar no cardápio…"
                className={styles.searchInput}
                tabIndex={searchOpen ? 0 : -1}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
