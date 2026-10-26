export type Municipality = { id: number; nome: string }
export type State = { id: number; sigla: string; nome: string }

export const LocationService = {
  listStates: async (): Promise<State[]> => {
    const response = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    )
    if (!response.ok) throw new Error('Não foi possível carregar os estados')
    return response.json() as Promise<State[]>
  },
  listMunicipalities: async (state: string): Promise<Municipality[]> => {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
    )
    if (!response.ok) throw new Error('Não foi possível carregar as cidades')
    return response.json() as Promise<Municipality[]>
  },
}
