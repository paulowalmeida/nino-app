# Testes

- **Teste nunca co-localizado — sempre em `src/__tests__/`, espelhando a
  estrutura de `src/`.** Ex.: `src/elements/BackLink/BackLink.tsx` →
  `src/__tests__/elements/BackLink/BackLink.test.tsx`. O teste importa o
  arquivo testado pelo path alias normal (`@elements/BackLink/BackLink`),
  nunca por caminho relativo `./BackLink`. Confirmado a partir de 2026-08-03
  para `elements/`/`components/` do `manager` — convenção a adotar daqui pra
  frente no resto do app; não precisa migrar teste legado já co-localizado
  (`hooks/`, `services/`, etc.) só por isso.
- `describe(Component.name, () => {})` — nunca atribuir `Component.displayName`
  só pra isso; `const Component = (...) => ...` já tem `.name` inferido pelo
  JS a partir do nome da variável, sem precisar de linha extra
- `it()` in English, max 80 chars
- Sem `as any` em mocks — usar `Partial<T>` ou `Pick<T, ...>`
- **Um único `describe` por arquivo** — sem aninhar. Pra diferenciar contexto,
  colocar no próprio nome do `it()` (`"reorder: should ..."`), não em outro
  `describe` dentro do primeiro. Confirmado como padrão em todo o `manager`.
- **Nunca `as never` pra forçar um mock** — usar `as unknown as T`. `as never`
  engana o compilador em vez de expressar o tipo real esperado, e existe hoje
  em produção (`useReorderCategories.test.tsx`, `useReorderMenuItems.test.tsx`,
  `DeleteItemDialog.test.tsx`) — corrigir ao tocar nesses arquivos, não repetir
  o padrão em teste novo.

```ts
// ERRADO
vi.mocked(setCategoryPosition).mockResolvedValue({} as never)

// CORRETO
vi.mocked(setCategoryPosition).mockResolvedValue(
  {} as unknown as ProductCategory
)
```

- **Mocks em arquivo `<nome>.mock.ts` separado, na mesma pasta do arquivo
  testado** — nunca declarados inline no teste. Prática nova (o `manager`
  hoje faz `vi.mock()` + dado mockado direto no `.test.tsx`); adotar a
  partir de agora, sem precisar migrar teste existente que já funciona.

  ```
  hooks/product/
    useReorderCategories.ts
    useReorderCategories.mock.ts   ← exporta os mocks do service usado
    useReorderCategories.test.tsx  ← importa do .mock.ts
  ```

  **Why:** mantém o arquivo de teste menor e legível, e o mock fica
  reutilizável por outros testes que dependem do mesmo service/hook — sem
  isso, cada teste novo reconstrói o mesmo `vi.fn()`/objeto fake do zero.

- **Padrão AAA (Arrange / Act / Assert) com os três comentários** em todo
  `it()` que tenha mais de uma linha de código no corpo — não só nos "grandes":
  se o `it()` faz mais que uma chamada seguida de uma assertion trivial única,
  leva os comentários. Quando Arrange e Act se fundem numa linha só (ex.: só
  um `render(...)`), usar `// Arrange / Act` combinado, mas não pular o
  comentário. Prática nova a adotar a partir de agora.

  ```ts
  it('reorders the cache optimistically before the request resolves', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, buildList())
    vi.mocked(setCategoryPosition).mockResolvedValue(fakeCategory)

    // Act
    const { result } = renderHook(() => useReorderCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })
    result.current.mutate({ positions: [{ id: 'cat-a', position: 2 }] })

    // Assert
    await waitFor(() => expect(idsIn(client)).toEqual(['cat-b', 'cat-a']))
  })
  ```

  **Why:** padroniza a leitura — qualquer pessoa acha rápido onde o teste
  monta o cenário, onde aciona o comportamento e onde confere o resultado,
  sem precisar decifrar a estrutura de cada arquivo.

- **Nunca criar função auxiliar só pra fazer o teste funcionar** (ex.:
  `createAxiosResponse`). Se o teste precisa de um helper desses, o service
  está vazando estrutura crua em vez de tipo de domínio — corrigir a
  implementação (ver `code-style.md`, "Services — nunca vazar o wrapper de
  HTTP"), não criar helper no teste pra contornar.
- **Nomes autosugestivos em teste** — variável, helper e descrição de
  `it()`/`describe()` revelam o que representam (`inactiveContract`,
  `expiredToken`, `emptyUserList`), nunca `data`, `fn`, `test 1`.
- **Teste obrigatório em todo arquivo elegível** de componente, service, hook
  ou util — novo ou legado —, cobrindo caminho feliz, casos de borda (lista
  vazia, nulo, string vazia) e cenário de erro. Não existe isenção por
  "arquivo antigo que já funciona sem teste": ao tocar ou revisar um arquivo
  elegível sem teste, criar o teste faz parte do trabalho.
- **Lógica de interação complexa vira hook**, não só busca de dado — um
  fluxo com estado próprio (abrir/fechar, validação, múltiplos passos)
  dentro de uma página ganha um hook dedicado (`useCreateCategoryInline`,
  por exemplo) em vez de viver solto no componente. Prática nova a adotar
  daqui pra frente.
