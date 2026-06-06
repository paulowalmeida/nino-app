import { HourlyChart } from "@demo/_tabs/dashboard/_components/hourly-chart/HourlyChart"
import { OrderRow } from "@demo/_tabs/dashboard/_components/order-row/OrderRow"
import { StatCard } from "@demo/_tabs/dashboard/_components/stat-card/StatCard"
import { chartBars, chartLabels, orders, stats } from "./dashboardTab.constants"
import styles from "./DashboardTab.module.css"

export function DashboardTab() {
  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <div className={styles.storeName}>Burgão do Zé</div>

          <div className={styles.storeOpenStatus}>
            Quinta-feira, 20 mar · Aberto agora
          </div>
        </div>

        <div className={styles.periodFilters}>
          <div
            className={`${styles.periodFilter} ${styles.periodFilterActive}`}
          >
            Hoje
          </div>

          <div className={styles.periodFilter}>7 dias</div>

          <div className={styles.periodFilter}>Mês</div>
        </div>
      </div>

      <div className={styles.dashboardBody}>
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <HourlyChart
          bars={chartBars}
          labels={chartLabels}
          peakRange="18h–19h"
        />

        <div className={styles.recentOrdersCard}>
          <div className={styles.recentOrdersHeader}>
            <span className={styles.recentOrdersTitle}>Pedidos recentes</span>

            <span className={styles.viewAllLink}>Ver todos →</span>
          </div>
          {orders.map((o) => (
            <OrderRow key={o.customer} {...o} />
          ))}
        </div>
      </div>
    </div>
  )
}
