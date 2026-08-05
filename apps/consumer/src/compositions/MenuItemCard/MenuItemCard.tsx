import type { MouseEvent } from 'react'

import { Image } from '@nino/ds/components/Image'
import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'
import type { MenuItem } from '@custom_types/menu/menu-item'

import styles from './MenuItemCard.module.css'

type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
  /** Loja fechada: mostra o item apagado e não deixa pedir. */
  disabled?: boolean
  /** Emoji da categoria para o ladrilho quando o item não tem foto. */
  fallbackIcon?: string | null
  /** Quantas unidades já estão na sacola — 0 não marca nada. */
  quantity?: number
}

/**
 * O item como o cliente decide: o texto à esquerda para ler, a foto emoldurada
 * à direita para desejar e o botão de somar ancorado no canto dela — o alvo do
 * polegar fica junto do que dá vontade. Sem foto, um ladrilho quente com o
 * emoji da categoria segura o lugar, em vez de um quadrado vazio.
 *
 * O `2×` antes do preço é a mesma notação do resumo do pedido: o cardápio
 * mostra o que já está escrito na comanda que a pessoa está montando.
 */
export const MenuItemCard = ({
  item,
  onAdd,
  onSelect,
  disabled = false,
  fallbackIcon,
  quantity = 0,
}: MenuItemCardProps) => {
  const image = primaryImage(item)
  const glyph = categoryIcon(item.name) ?? fallbackIcon ?? '🍽️'

  const handleAdd = (event: MouseEvent) => {
    event.stopPropagation()
    if (disabled) return
    onAdd(item)
  }

  return (
    <article
      className={disabled ? `${styles.card} ${styles.disabled}` : styles.card}
      onClick={() => !disabled && onSelect(item)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(event) =>
        !disabled && event.key === 'Enter' && onSelect(item)
      }
    >
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
        <span className={styles.price}>{brl(item.price)}</span>
      </div>

      <div className={styles.media}>
        {quantity > 0 && (
          <span className={styles.tally} aria-label={`${quantity} na sacola`}>
            {quantity}×
          </span>
        )}

        <Image
          src={image}
          alt=""
          className={styles.photo}
          placeholder={
            <div className={styles.photoFallback} aria-hidden="true">
              <span className={styles.fallbackGlyph}>{glyph}</span>
            </div>
          }
        />

        <Button
          variant="primary"
          size="icon"
          className={styles.add}
          aria-label={`Adicionar ${item.name}`}
          disabled={disabled}
          onClick={handleAdd}
        >
          <Icon name="plus" />
        </Button>
      </div>
    </article>
  )
}
