import { Outlet, useLocation, useNavigate } from 'react-router'

import { Tabs } from '@nino/ds/components/Tabs'
import { UNIT_DETAIL_TABS } from '@pages/Units/constants/unit.constants'

/*
 * WHY: cada seção da unidade tem o próprio salvar, então o lugar precisa caber
 * na URL — voltar sai da aba, não da unidade, e um link para o cashback abre no
 * cashback. Daí abas sobre sub-rotas em vez de painéis locais.
 */
export const UnitDetailTabs = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const active =
    UNIT_DETAIL_TABS.find(({ segment }) => segment && pathname.endsWith(segment))
      ?.value ?? 'info'

  return (
    <Tabs
      value={active}
      onValueChange={(value) => {
        const tab = UNIT_DETAIL_TABS.find((item) => item.value === value)
        void navigate(tab?.segment ? tab.segment : '.')
      }}
      tabs={UNIT_DETAIL_TABS.map(({ value, label }) => ({
        value,
        label,
        // CONSTRAINT: Ark mantém painel inativo montado; repetir o Outlet
        // neles montaria a mesma rota três vezes.
        content: value === active ? <Outlet /> : null,
      }))}
    />
  )
}
