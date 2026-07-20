import { useState } from 'react'
import { useParams } from 'react-router'

import { CategoryNav } from '@compositions/CategoryNav/CategoryNav'
import { MenuItemCard } from '@compositions/MenuItemCard/MenuItemCard'
import { StoreHeader } from '@compositions/StoreHeader/StoreHeader'
import { useActiveSection } from '@hooks/useActiveSection'
import { useMenu } from '@hooks/useMenu'
import { useStore } from '@hooks/useStore'

import { StorefrontSkeleton } from './StorefrontSkeleton'
import styles from './Storefront.module.css'

const sectionDomId = (id: string): string => `section-${id}`

export const Storefront = () => {
  const { slug } = useParams()
  const { store, isPending: loadingStore, isError } = useStore(slug)
  const { sections, isPending: loadingMenu } = useMenu(store?.id)

  const activeId = useActiveSection(sections.map((section) => section.id))
  const [added, setAdded] = useState(0)

  const handleAdd = () => setAdded((n) => n + 1)

  const goToSection = (id: string) => {
    document
      .getElementById(sectionDomId(id))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loadingStore) return <StorefrontSkeleton />

  if (isError || !store) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Loja não encontrada</h1>
        <p className={styles.notFoundText}>
          Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <StoreHeader store={store} />

      {sections.length > 0 && (
        <CategoryNav
          sections={sections}
          activeId={activeId}
          onSelect={goToSection}
        />
      )}

      <main className={styles.menu}>
        {loadingMenu && <p className={styles.hint}>Carregando o cardápio…</p>}

        {!loadingMenu && sections.length === 0 && (
          <p className={styles.hint}>
            Esta loja ainda não publicou itens no cardápio.
          </p>
        )}

        {sections.map((section) => (
          <section
            key={section.id}
            id={sectionDomId(section.id)}
            className={styles.section}
            aria-label={section.name}
          >
            <h2 className={styles.sectionTitle}>{section.name}</h2>
            <div className={styles.items}>
              {section.items.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {added > 0 && (
        <div className={styles.cartBar}>
          <span className={styles.cartCount}>
            {added} {added === 1 ? 'item' : 'itens'} na sacola
          </span>
          <span className={styles.cartSoon}>Sacola em breve</span>
        </div>
      )}
    </div>
  )
}
