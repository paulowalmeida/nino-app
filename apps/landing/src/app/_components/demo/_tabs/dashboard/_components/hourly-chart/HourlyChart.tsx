import type { HourlyChartProps } from "./HourlyChart.types"
import styles from "./HourlyChart.module.css"

export function HourlyChart({ bars, labels, peakRange }: HourlyChartProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>Pedidos por hora</span>
        {peakRange && (
          <span className={styles.peakLabel}>pico: {peakRange}</span>
        )}
      </div>

      <svg className={styles.chartSvg} height="260" viewBox="0 0 540 260">
        {[20, 75, 130, 185].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="540"
            y2={y}
            stroke="#F1F3F5"
            strokeWidth="1"
          />
        ))}
        {bars.map(({ x, h, color }) => (
          <rect
            key={x}
            x={x}
            y={230 - h}
            width="30"
            height={h}
            rx="4"
            fill={color}
          />
        ))}
        {labels.map(({ x, label, peak }) => (
          <text
            key={x}
            x={x}
            y="250"
            textAnchor="middle"
            fontSize="10"
            fill={peak ? "#FF6B00" : "#9CA3AF"}
            fontFamily="sans-serif"
            fontWeight={peak ? "700" : undefined}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
