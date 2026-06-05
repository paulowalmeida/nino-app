import styles from './PhoneMockup.module.css'

const categories = [
  { label: '🍔 Lanches', active: true },
  { label: '🍕 Pizzas', active: false },
  { label: '🥤 Bebidas', active: false },
]

const menuItems = [
  {
    thumb: '🍔',
    title: 'X-Burgão Especial',
    desc: '2 hambúrgueres, cheddar, bacon',
    price: 'R$ 28,90',
  },
  {
    thumb: '🍟',
    title: 'Combo Família',
    desc: '2 X-Burgão + fritas + refri',
    price: 'R$ 69,90',
  },
]

export function PhoneMockup() {
  return (
    <div className={styles.phone}>
      <div className={styles.notch} />
      <div className={styles.screen}>
        <div className={styles.storeHeader}>
          <div className={styles.storeLogo}>🍔</div>
          <div>
            <div className={styles.storeName}>Burgão do Zé</div>
            <div className={styles.storeMeta}>
              <b>★ 4.8</b> · 25–40 min · Frete R$3,99
            </div>
          </div>
        </div>

        <div className={styles.freeShipping}>
          <div>
            <b>Frete grátis acima de R$35</b>
            <span>Faltam R$6,10</span>
          </div>
          <div className={styles.freeShippingTag}>ATIVAR</div>
        </div>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={cat.active ? styles.categoryActive : undefined}
            >
              {cat.label}
            </div>
          ))}
        </div>

        {menuItems.map((item) => (
          <div key={item.title} className={styles.menuItem}>
            <div className={styles.itemThumb}>{item.thumb}</div>
            <div>
              <b className={styles.itemTitle}>{item.title}</b>
              <span className={styles.itemDesc}>{item.desc}</span>
              <div className={styles.itemPrice}>{item.price}</div>
            </div>
          </div>
        ))}

        <div className={styles.cartBar}>
          <span>1 item · Ver sacola</span>
          <span>R$ 28,90 →</span>
        </div>
      </div>
    </div>
  )
}
