import { EmptyState } from '@nino/ds/components/EmptyState'
import { NinoMascot } from '@nino/ds/components/NinoMascot'

export const CashEmptyDay = () => (
  <EmptyState
    size="md"
    illustration={<NinoMascot />}
    title="Nenhum caixa nesse dia"
  >
    Ninguém abriu o caixa nessa data. Escolha outro dia para ver o balanço.
  </EmptyState>
)
