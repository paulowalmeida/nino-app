import type { HomeDraft } from '@pages/Units/types/HomeDraft.type'

export const DEFAULT_HOME_DRAFT: HomeDraft = {
  showBanner: true,
  showSearch: true,
  showCategoryBar: true,
  showStoreInfo: true,
}

export const HOME_BLOCK_FIELDS = [
  {
    field: 'showBanner',
    label: 'Banner',
    helperText: 'A faixa com a foto no topo da loja.',
  },
  {
    field: 'showSearch',
    label: 'Busca',
    helperText: 'Campo para o cliente procurar um item pelo nome.',
  },
  {
    field: 'showCategoryBar',
    label: 'Barra de categorias',
    helperText: 'Atalho fixo para pular entre as seções do cardápio.',
  },
  {
    field: 'showStoreInfo',
    label: 'Informações da loja',
    helperText: 'Endereço, horários e formas de pagamento.',
  },
] as const
