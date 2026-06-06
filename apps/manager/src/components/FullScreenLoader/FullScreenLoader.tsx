import { Spinner } from '@nino/ds'

const wrap = 'flex min-h-screen items-center justify-center bg-white'

export function FullScreenLoader() {
  return (
    <div className={wrap}>
      <Spinner visible size={28} />
    </div>
  )
}
