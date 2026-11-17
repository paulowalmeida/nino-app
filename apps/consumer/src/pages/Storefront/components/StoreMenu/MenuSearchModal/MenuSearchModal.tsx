import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Drawer } from '@nino/ds/components/Drawer'
import { Text } from '@nino/ds/components/Text'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { MenuSearchResult } from '@pages/Storefront/components/StoreMenu/MenuSearchResult/MenuSearchResult'
import { StoreTintScope } from '@shared/components/StoreTintScope/StoreTintScope'
import motion from '@styles/motion.module.css'
import { SearchEmptyIllustration } from '@shared/components/Illustrations/SearchEmptyIllustration/SearchEmptyIllustration'
import { SearchIllustration } from '@shared/components/Illustrations/SearchIllustration/SearchIllustration'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import styles from './MenuSearchModal.module.css'

const RESULT_SELECTOR = '[data-search-result]'

/**
 * A busca do cardápio: gaveta lateral como as demais, tela cheia abaixo de md. O
 * campo da página só abre esta modal — a lista da página nunca é filtrada por
 * baixo. Seta para baixo desce do campo para os resultados, Enter abre o
 * primeiro e Escape fecha (o foco volta ao campo que abriu).
 */
export const MenuSearchModal = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    search,
    setSearch,
    searchResults,
    hasSearchQuery,
    sections,
    quantityByProduct,
    openProduct,
  } = useStorefrontFacade()
  const inputRef = useRef<HTMLInputElement>(null)

  /* WHY: `autoFocus` dispara com a gaveta ainda fora da tela; o navegador rola
     até o campo e a entrada pisca vindo do lado errado. O foco vem depois do
     primeiro quadro e sem rolagem. No toque o foco abriria o teclado por cima
     das categorias, então lá a pessoa toca no campo quando quiser. */
  useEffect(() => {
    if (!isSearchOpen) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const frame = requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
    return () => cancelAnimationFrame(frame)
  }, [isSearchOpen])
  const listRef = useRef<HTMLDivElement>(null)

  const select = (item: MenuItem) => {
    setSearchOpen(false)
    openProduct(item)
  }

  const clear = () => {
    setSearch('')
    inputRef.current?.focus()
  }

  const rows = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(RESULT_SELECTOR) ?? []
    )

  const handleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && searchResults[0]) {
      event.preventDefault()
      select(searchResults[0].item)
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      rows()[0]?.focus()
    }
  }

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const all = rows()
    const index = all.indexOf(document.activeElement as HTMLElement)
    if (index < 0) return
    event.preventDefault()
    if (event.key === 'ArrowDown') all[index + 1]?.focus()
    else if (index === 0) inputRef.current?.focus()
    else all[index - 1]?.focus()
  }

  const count = searchResults.length

  /* WHY: o campo é o próprio título da gaveta — um título "Buscar no
     cardápio" acima de um campo que diz o mesmo seria eco. O nome acessível
     do diálogo fica no texto oculto. */
  const field = (
    <>
      <Text as="span" className="sr-only">
        Buscar no cardápio
      </Text>
      <Box className={styles.menuSearchModalField}>
        <Icon name="search" className={styles.menuSearchModalIcon} />
        <Input
          ref={inputRef}
          type="search"
          aria-label="Buscar no cardápio"
          placeholder="Buscar no cardápio"
          className={styles.menuSearchModalInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {hasSearchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className={styles.menuSearchModalClear}
            aria-label="Apagar texto"
            onClick={clear}
          >
            <Icon name="x" size="sm" />
          </Button>
        )}
      </Box>
    </>
  )

  const body = (
    <>
      <Box
        ref={listRef}
        className={styles.menuSearchModalScroll}
        onKeyDown={handleListKeyDown}
      >
        {!hasSearchQuery && (
          <Box className={styles.menuSearchModalIdle}>
            <EmptyState
              size="md"
              className={styles.menuSearchModalEmpty}
              illustration={
                <Box className={motion.land}>
                  <SearchIllustration />
                </Box>
              }
              title="O que vai ser hoje?"
            >
              Digite o nome de um prato ou escolha uma categoria.
            </EmptyState>
            <Box as="section" className={styles.menuSearchModalCategories}>
              <Heading level={3} className={styles.menuSearchModalHeading}>
                Buscar por categoria
              </Heading>
              <Box direction="row" className={styles.menuSearchModalChips}>
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch(section.name)
                      inputRef.current?.focus()
                    }}
                  >
                    {section.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {hasSearchQuery && count > 0 && (
          <>
            <Text as="p" role="status" className={styles.menuSearchModalCount}>
              {count} {count === 1 ? 'resultado' : 'resultados'}
            </Text>
            <Box as="ul" className={styles.menuSearchModalList}>
              {searchResults.map(({ item, categoryName }) => (
                <MenuSearchResult
                  key={item.id}
                  item={item}
                  categoryName={categoryName}
                  query={search}
                  quantity={quantityByProduct[item.id] ?? 0}
                  onSelect={select}
                />
              ))}
            </Box>
          </>
        )}

        {hasSearchQuery && count === 0 && (
          <EmptyState
            size="md"
            role="status"
            className={styles.menuSearchModalEmpty}
            illustration={
              <Box className={motion.land}>
                <SearchEmptyIllustration />
              </Box>
            }
            title="Nenhum item encontrado"
            action={
              <Button variant="outline" onClick={clear}>
                Limpar busca
              </Button>
            }
          >
            Não encontramos resultados para “{search.trim()}”. Tente outro
            termo.
          </EmptyState>
        )}
      </Box>
    </>
  )

  return (
    <Drawer
      open={isSearchOpen}
      onOpenChange={setSearchOpen}
      placement="right"
      size="26rem"
      fullOnMobile
      title={field}
      contentClassName={styles.menuSearchModalPanel}
      bodyClassName={styles.menuSearchModalBody}
    >
      <StoreTintScope>{body}</StoreTintScope>
    </Drawer>
  )
}
