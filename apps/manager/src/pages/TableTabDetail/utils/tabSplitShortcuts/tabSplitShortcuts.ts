import type { TabSplitShortcut } from '@pages/TableTabDetail/types/TabSplitShortcut.type'

const SPLIT_PEOPLE = [2, 3, 4] as const

const floorCents = (amount: number): number =>
  Math.floor(amount * 100 + 1e-6) / 100

/* WHY: a divisão é sempre do que falta, não do total: depois que um paga a
 * parte dele, "÷2" divide o resto entre os dois que sobraram. A parte é
 * arredondada para baixo e a última quita com "Tudo", que leva o centavo
 * que sobra.
 */
export const tabSplitShortcuts = (
  remainingAmount: number
): TabSplitShortcut[] => {
  const splits = SPLIT_PEOPLE.map((people) => ({
    label: `÷${people}`,
    description: `Dividir o que falta por ${people}`,
    amount: floorCents(remainingAmount / people),
  })).filter((split) => split.amount >= 0.01)
  return [
    {
      label: 'Tudo',
      description: 'Pagar tudo que falta',
      amount: remainingAmount,
    },
    ...splits,
  ]
}
