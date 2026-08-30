import { useCounterStore } from '@pages/Counter/states/counter/counter.store'

export const useCounterReceipt = () => {
  const lastSale = useCounterStore((state) => state.lastSale)
  const dismissReceipt = useCounterStore((state) => state.clearLastSale)

  return { lastSale, dismissReceipt }
}
