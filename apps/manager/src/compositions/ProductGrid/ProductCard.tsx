import { useState } from 'react'

import { Modal } from '@nino/ds/components/Modal'
import { ItemThumb } from '@components/ItemThumb/ItemThumb'
import { useLongPress } from '@hooks/ui/useLongPress'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import type { ProductCardProps } from './ProductCard.types'

import styles from './ProductGrid.module.css'
import motion from '@styles/motion.module.css'

/**
 * Um item do cardápio no caixa. Toque adiciona à venda; segurar espia o
 * produto sem adicionar — a mesma leitura que o operador faria abrindo o
 * cardápio, sem sair da venda em andamento.
 */
export const ProductCard = ({ item, index, onPick }: ProductCardProps) => {
  const [preview, setPreview] = useState(false)

  const { isPressing, handlers } = useLongPress({
    onLongPress: () => setPreview(true),
    onRelease: () => setPreview(false),
  })

  const photo = item.images?.[0]?.url

  return (
    <>
      <button
        type="button"
        onClick={() => onPick(item)}
        style={riseDelay(index * 25)}
        className={`${motion.settle} ${motion.press} ${styles.card} ${
          isPressing ? styles.pressing : ''
        }`}
        {...handlers}
      >
        <ItemThumb name={item.name} imageUrl={photo} className={styles.thumb} />
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>{brl(item.price)}</span>
      </button>

      {/*
       * No centro da tela e com o fundo desfocado, como o preview de foto do
       * Instagram — e sem botão de fechar: quem abriu foi o dedo, e soltar
       * fecha. Um X aqui seria alvo impossível de acertar sem largar o gesto.
       *
       * Montado só quando abre: o diálogo do Ark mantém o conteúdo no DOM
       * mesmo fechado, e a grade tem dezenas de itens — seriam dezenas de
       * diálogos parados na página para um preview de cada vez.
       */}
      {preview && (
        <Modal
          open
          onOpenChange={setPreview}
          dismissible={false}
          size="lg"
          ariaLabel={`Prévia de ${item.name}`}
          backdropClassName={styles.previewBackdrop}
          body={
            <div className={styles.preview}>
              {/* O mesmo ladrilho do card, em tamanho de olhar: sem foto ele
                  cai no emoji da categoria em vez de deixar buraco. */}
              <ItemThumb
                name={item.name}
                imageUrl={photo}
                className={styles.previewPhoto}
              />
              <p className={styles.previewName}>{item.name}</p>
              {item.description && (
                <p className={styles.previewText}>{item.description}</p>
              )}
              <p className={styles.previewPrice}>{brl(item.price)}</p>
            </div>
          }
        />
      )}
    </>
  )
}
