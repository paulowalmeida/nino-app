# Estilo de código

## Formatação

- Sem ponto e vírgula, aspas simples, máx 80 chars/linha
- Sem `any` — types reais
- Sem comentários óbvios (comentário só existe pra explicar um WHY que não
  dá pra ver no código — constraint escondida, motivo de uma escolha,
  workaround. Nunca pra narrar histórico/"isso substitui o que tinha antes"/
  referenciar a tarefa atual — isso é conteúdo de PR, não de código)
- Nomes autosugestivos são obrigatórios em tudo — ver seção dedicada
  "Nomes autoexplicativos" logo abaixo

## Tamanho de arquivo

Arquivo com mais de 250 linhas é candidato sério a ser dividido em dois.
Não é limite rígido — antes de dividir, checar se existe um corte natural
(um sub-componente que já tem nome e responsabilidade próprios, um hook que
encapsula lógica reaproveitável) em vez de fatiar arbitrariamente. Ver
`components.md`, "Quando componentizar" e "Camadas — services → hooks →
componentes", pra critério de onde cortar.

## Nomes autoexplicativos

**Propósito, não checklist:** quem lê o nome sozinho — sem abrir o arquivo,
sem contexto adicional — precisa entender o que a coisa É ou FAZ. Se for
preciso abrir o arquivo pra saber o que `data`, `handleClick`, `Item` ou
`useStuff` significam, o nome falhou. Vale pra tudo: arquivo, variável,
constante, função, método, componente, hook, state, provider, service,
`className`/classe CSS, arquivo de asset.

1. **O nome descreve o QUÊ ou O QUE FAZ, nunca ONDE é usado ou QUANDO foi
   criado.** É o mesmo critério já aplicado aos ícones SVG (`nav-card.svg` →
   `credit-card.svg`: o nome descreve a forma, não a categoria de uso) —
   vale igual pra `className`, componente, hook, arquivo. Um componente
   pode ser reaproveitado fora do contexto original; o nome baseado em
   "onde nasceu" não sobrevive a isso.
2. **Nada de nome genérico fantasma como nome final**: `data`, `item`,
   `value`, `handler`, `temp`, `info`, `stuff`, `helper`, `utils` sozinhos
   não dizem nada. Só valem como parte de um nome mais específico
   (`orderData` ok, `data` sozinho não; `menuItem` ok, `item` sozinho não).
3. **Booleano começa com verbo de estado** — `is`, `has`, `should`, `can`
   (`isPending`, `hasPhoto`), nunca o substantivo/adjetivo cru (`pending`,
   `photo`) como nome de uma variável booleana.
4. **Hook nomeado pelo que expõe pra quem consome, não pelo mecanismo
   interno** — `useCurrentTenant`, não `useTenantQuery` (quem usa o hook
   não precisa saber que por dentro é react-query, TanStack, fetch cru,
   tanto faz).
5. **Service usa o verbo da ação real**, sem genérico (`getById`, nunca
   `get`/`show`/`find`; ver code-style.md, "Services — convenção
   `getById`").
6. **Duas coisas parecidas precisam de nome que distingue a VARIAÇÃO
   real**, não um sufixo numérico ou vazio — `chevron-up`/`chevron-down`,
   nunca `chevron`/`chevron2`; `trash`/`trash-thin` já é o limite aceitável
   só quando a variação é puramente visual e não tem outro jeito de nomear.
7. **Nome curto só quando o escopo é pequeno E o contexto ao redor já
   desambigua** — `i` num loop de 3 linhas é aceitável; `i` como campo de
   um objeto exportado ou parâmetro de função pública não é.
8. **Pergunta de revisão, antes de aceitar um nome**: alguém que nunca viu
   esse arquivo entenderia o que isso é/faz só pelo nome, sem abrir nada
   mais? Se a resposta for "só se eu souber o contexto de onde foi
   criado", o nome precisa mudar.

## Idioma

- Todo código em inglês — nomes de variável/type/função, comentários/JSDoc,
  nomes e conteúdo de stories, descrições de `argTypes` e de `it()`
- **Exceção: texto voltado ao usuário final fica em português.**
  `aria-label`, `alt`, `title` e qualquer outro texto lido por leitor de tela
  ou exibido na UI são copy de produto, não código — o usuário do app é
  brasileiro. Não traduzir.
- Português apenas nas mensagens de conversa e no texto voltado ao usuário
  final (ver exceção acima), nunca no código em si

## Handlers e callbacks

- Usar arrow functions (`const handleX = () => {}`) para handlers e callbacks
  locais em componentes, nunca function declarations

## Path aliases

Sempre `@alias/caminho`, nunca `@/caminho` (com barra logo depois do `@`) —
são aliases distintos, um por pasta de `src/`, e não existe um alias `@/`
genérico apontando pra raiz.

```ts
import { BackLink } from '@components/BackLink'   // ✅
import { BackLink } from '@/components/BackLink'  // ❌ não existe
```

Aliases configurados hoje (`vite.config.ts` do `manager`): `@ds`, `@adapters`,
`@assets`, `@components`, `@compositions`, `@constants`, `@custom_types`,
`@styles`, `@elements`, `@hooks`, `@layouts`, `@lib`, `@pages`, `@providers`,
`@router`, `@services`, `@skeletons`, `@states`, `@utils`.

## `@constants` vs `@adapters`

`@constants/*.constants.ts` é só dado — array e objeto literal estático,
sem JSX, um arquivo por domínio (`order`, `product`, `auth`, `team`...).
Quando um dado desses precisa virar elemento React (um "demo" com o
componente real renderizado, um ícone escolhido por uma chave), esse mapeamento
vai para `@adapters/*.adapter.tsx` — nunca dentro do próprio arquivo de
constants, que teria que virar `.tsx` e deixaria de ser "dado puro" pros
outros consumidores. O padrão: `constants/x.constants.ts` guarda os campos
(`demoKey: 'order-ticket'`), `adapters/x.adapter.tsx` exporta uma função que
recebe a chave e devolve o JSX (`welcomePanelDemo(key)` —
ver `constants/welcome.constants.ts` + `adapters/welcomePanelDemo.adapter.tsx`).

Um adapter por arquivo, nome batendo com o domínio que adapta — mesmo
critério de "um arquivo, uma responsabilidade" de hook/guard/loader.

**`@services` vs `@lib`:** `@services/*.service.ts` fala com um recurso
específico da API (`order.service.ts`, `product.service.ts`...). `@lib` é
infraestrutura que não fala com nenhum recurso — transporte HTTP de baixo
nível, locks, esse tipo de coisa (`@lib/http/http-client.ts` — o
`createHttpClient`/`ky` —, `@lib/http/refresh-lock.ts`).

**Exceção deliberada: `services/http/http.service.ts`.** Não fala com um
recurso específico, mas mora em `services/` mesmo assim — é o `HttpFactory`
que expõe os verbos parametrizados (`get`/`create`/`update`/`patch`/`remove`)
e a instância `api` compartilhada que todo `*.service.ts` importa. Fica
perto de quem consome porque é usado por praticamente todo arquivo da pasta,
não porque vira `*.service.ts` de recurso.

## Imports (ordem obrigatória)

1. React / framework (`react`, `next/...`, `react-router`)
2. *(linha em branco)*
3. Libs terceiras (`@ark-ui/react`, `framer-motion`, etc.)
4. *(linha em branco)*
5. Pacotes do workspace (`@nino/...`) e aliases locais do app (`@components/`,
   `@compositions/`, `@hooks/`, `@utils/`, `@custom_types/`) — todos no mesmo
   grupo, sem linha em branco entre eles
6. *(linha em branco)*
7. Imports relativos (`../../`, `./`)
8. *(linha em branco)*
9. Estilos por último, sempre — `styles` do `.module.css` do próprio arquivo
   e depois `motion`/outros módulos de `@styles/*`

**Não é enforçado por lint em todo app.** `eslint-plugin-simple-import-sort`
só está configurado em `packages/ds`, `apps/backoffice`, `apps/courier` e
`apps/landing` — `apps/manager` e `apps/consumer` **não têm o plugin**, só
`no-restricted-imports` (que barra import de barrel, não ordena nada). Nesses
dois apps a ordem acima é convenção seguida manualmente, não garantida por
ferramenta — reparar visualmente ao revisar import de PR nesses apps.

## Nunca criar barrel em um pacote do workspace

Sempre o subcaminho, nunca a raiz do pacote:

```ts
import { Button } from '@nino/ds/components/Button'   // ✅
import { Button } from '@nino/ds'                     // ❌
```

Não é preferência de estilo. Um único import da raiz amarra o pacote inteiro
no mesmo chunk e anula o code-splitting: na tela de login do manager, o barrel
do DS trazia os 57 componentes — DatePicker, Carousel, ColorPicker, QRCode —
antes de qualquer rota. Migrar para subcaminho tirou o JS da primeira tela de
**1166 KB para 702 KB** e o maior chunk de 820 KB para 320 KB.

Basta **um** arquivo da cadeia inicial (`query-client.ts`, um layout, um guard)
para o ganho evaporar. Enforçado por `no-restricted-imports` nas configs de
ESLint dos apps; dentro do `packages/ds`, componentes também não importam o
barrel do próprio pacote.

Subcaminhos disponíveis hoje: `@nino/ds/components/*`, `@nino/ds/masks`,
`@nino/ds/validators`, `@nino/lib/enums`, `@nino/lib/types/*`,
`@nino/lib/services/*`. Componente ou pacote novo nasce com o `exports`
declarado no `package.json` — sem isso, o consumidor é empurrado de volta ao
barrel.

## Types

- Sempre `type`, **nunca** `interface` (`extends` vira intersection `A & {}`)
- Nunca `export default` — sempre named export
- **Critério de onde um type mora é uso, não se é Props ou não** (confirmado
  em 2026-08-04): type usado **só dentro de um único arquivo** fica inline
  nesse arquivo — vale pra props do componente e vale igual pra type interno
  qualquer (draft de formulário, estado de UI local, helper de render). Não
  criar `ComponentName.types.ts` pra isolar um type que só o próprio
  componente usa — regra vigente no `manager` desde 2026-08-03 e no
  `consumer` desde 2026-08-05 (migrado nessa data: `components/` e
  `compositions/` inteiros, 15 arquivos `.types.ts` removidos); `courier` e
  `backoffice` ainda não migrados
- **Type usado por mais de um arquivo, ou com potencial real de reuso mesmo
  que hoje só apareça em um** (mesmo critério de `components.md`,
  "Quando componentizar" — potencial real, não hipotético especulativo) vai
  pra `src/types/<dominio>/`, **um type por arquivo** em kebab-case
  (`CompleteOnboardingRequest` → `complete-onboarding-request.ts`). **Sem
  barrel** (confirmado em 2026-08-04: barrel só é válido dentro do
  `@nino/ds` — nenhum outro projeto do monorepo tem, `src/types/*` incluído)
  — import sempre direto do arquivo (`@custom_types/order/order`, nunca
  `@custom_types/order`). Domínio novo sem pasta ainda → criar a pasta
  seguindo o padrão dos domínios existentes em `src/types/*`
- Um type que hoje só é usado localmente mas passa a ser importado em outro
  arquivo migra pra `src/types/<dominio>/` nesse momento — não antes

## Camadas — services → hooks → componentes

- `services/*.service.ts` fala com a API e só isso: sem lógica de UI, sem
  estado.
- `hooks/*` chama o service (geralmente via react-query) e expõe estado
  pronto pra tela (`isPending`, `isError`, dado já formatado).
- Componentes de página/composição recebem dado via hook — nunca chamam
  `fetch`/service diretamente. Isso é o que deixa um componente "burro":
  troca de fonte de dado (novo endpoint, cache diferente) não toca o JSX.

```ts
// ERRADO — página busca dado direto
const Orders = () => {
  const [orders, setOrders] = useState([])
  useEffect(() => { orderService.list(tenantId).then(setOrders) }, [tenantId])
  ...
}

// CORRETO — página só consome o hook
const Orders = () => {
  const { orders, isPending } = useOrders(tenantId)
  ...
}
```

**Why:** trocar a fonte de dado (nova query, invalidação, paginação) vira
mudança só no hook — a página nem percebe. É o padrão em todo `manager`
(`useOrders`, `useCategories`, `useMenuItem`, etc.).

## Um arquivo, uma responsabilidade — hook, guard, loader

A regra "um componente por pasta" de `components.md` não é exclusiva de
componente — é o mesmo princípio aplicado em toda camada que expõe uma
unidade pública consumível de fora: **hook, guard e loader nascem um por
arquivo**, nome do arquivo batendo com o nome exportado
(`useCurrentTenant.ts` exporta só `useCurrentTenant`, `authGuard.ts` só
`AuthGuard`). Guard e loader (`guards/auth-guard.ts`, `loaders/root-loader.ts`,
`guards/session-guard.ts`) já nasceram assim — são o exemplo a seguir.

**Guard e loader moram em pastas próprias, não em `router/`** (confirmado
em 2026-08-04): `src/guards/*` (alias `@guards`) e `src/loaders/*` (alias
`@loaders`) — `router/` fica só com `routes.tsx` e o teste que exercita as
rotas montadas.

Hook auxiliar interno, não exportado, usado só de dentro do próprio hook
(uma função de formatação, um helper de cálculo) pode continuar no mesmo
arquivo — o critério é exportação pública, não "zero função além da
principal". O que não vale é dois ou mais hooks PÚBLICOS — cada um chamável
isoladamente por um componente diferente — dividindo o mesmo arquivo só
porque falam do mesmo recurso.

**Exceção deliberada: service.** `services/*.service.ts` já segue "um
arquivo por entidade" (ver "Services — convenção `getById`" abaixo), mas por
dentro os métodos vivem agrupados num único objeto exportado
(`TenantService = { getById, update, ... }`) — isso continua sendo **um
export por arquivo** (o objeto), não múltiplos exports soltos. Hook não tem
esse mesmo agrupador natural — `useTenantDetail`, `useSaveTenant`,
`useRemoveTenant` e `useSetMainTenant` num único `useTenantDetail.ts` são
quatro exports públicos, não um.

**Estado atual, não migrado:** confirmado em 2026-08-04 como convenção daqui
pra frente — vários hooks legados do `manager` ainda agrupam query e
mutations do mesmo recurso num arquivo só
(`useTenantDetail.ts`, `useCategories.ts`, `useProfile.ts`,
`useSettings.ts`, `usePause.ts`, `useOpeningHours.ts`, `useDeliveryZones.ts`,
`usePhones.ts`, `useCompany.ts`, `useCustomers.ts`, entre outros). Não é
migração automática — hook novo já nasce um por arquivo; separar um arquivo
existente é decisão explícita (mexe em import de todo consumidor), não
faxina de reviewer.

## Estado global — zustand, nunca Context Provider

Estado de cliente compartilhado entre componentes usa **zustand**, um store
por domínio em `states/useXStore.ts` (`useSessionStore`, por exemplo). Não
existe (nem deve existir) `createContext` pra estado de aplicação no
`manager` — zustand já resolve subscrição seletiva sem o boilerplate de
Provider, e sem o problema de re-render em cascata que Context tem quando o
`value` não é memoizado.

```ts
// states/useXStore.ts
export const useXStore = create<XState>((set) => ({
  ...EMPTY,
  setX: (x) => set({ x }),
  clear: () => set(EMPTY),
}))
```

**Dado de servidor nunca entra no zustand.** Pedido, produto, zona de
entrega etc. são território do TanStack Query (hooks em `hooks/*`) — o
store de zustand guarda só estado de sessão/UI que não vem de fetch
(usuário logado, tenant ativo, e afins). Ver comentário em
`useSessionStore.ts`: "Server data (orders, products, zones) never lands
here — that is TanStack Query's territory."

## Services — convenção `getById`

Método de busca por id: sempre `getById(id: string)`. Nunca `show`, `get`,
`find`.

**Pré-requisito:** o service precisa estar segmentado por entidade (um
arquivo = uma entidade). Se um arquivo mistura ações de catálogo/criação
com CRUD de outra entidade, `getById` fica ambíguo — separar em arquivos
por entidade primeiro, só depois aplicar a convenção.

**Não é `getById`:** singletons sem id (`getMyCompany`, `getProfile`,
`getSubscription` — não recebem id, são "o meu X") e sub-recursos aninhados
de outra entidade (`getSettings`, `getPause` — buscam algo *do* tenant, não
o tenant em si).

## Services — nunca vazar o wrapper de HTTP

Toda função de service devolve o tipo de domínio, nunca a forma crua da
resposta HTTP (`Response`, `AxiosResponse`, o envelope `{ data: ... }` do
`ky`). O desempacotamento é responsabilidade do service — quem chama
(`hooks/*`, `states/*`) já recebe o dado limpo.

```ts
// ERRADO — hook desempacota o que o service devolveu cru
const res = await sessionService.getSession()
set({ session: res.data.data })

// CORRETO — service desempacota, hook recebe o tipo de domínio
export const getSession = async (): Promise<Session> => {
  const res = await httpClient.get<{ data: Session }>('auth/session')
  return res.data.data
}
const session = await sessionService.getSession()
set({ session })
```

**Why:** se o detalhe de infraestrutura (Axios, `ky`, fetch) vaza pra
camada de estado, trocar de cliente HTTP vira mudança em todo consumidor em
vez de mudança isolada no service. Já é o padrão em todo `manager`
(`session.service.ts`, `auth.service.ts` retornam `Promise<AuthUser>`,
`Promise<MeResponse>`, nunca a resposta crua do `ky`) — enunciado aqui pra
não regredir.
