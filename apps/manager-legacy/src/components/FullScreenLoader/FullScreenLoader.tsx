import { Spinner } from "@nino/ds"

import styles from "./FullScreenLoader.module.css"

export function FullScreenLoader() {
  return (
    <div className={styles.wrap}>
      <Spinner visible size={28} />
    </div>
  )
}
