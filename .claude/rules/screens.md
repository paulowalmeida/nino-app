# Telas: como dividir e navegar

Regras de estrutura de tela nos apps autenticados (SPA + React Router).

## Tela longa vira sub-rotas, não accordion nem tabs

Quando uma tela passa de ~2 blocos de conteúdo independentes (o caso de
Configurações: empresa, unidade, atendimento, horários, entrega, contato), a
divisão é por **rota filha**, com um índice de seções ao lado do `<Outlet />`.

Por quê, nesta ordem:

1. **A URL é o estado.** Link compartilhável, voltar do navegador funciona,
   recarregar devolve a pessoa na mesma seção. Accordion e tabs perdem tudo
   isso no F5.
2. **Cada painel fica curto.** Nenhuma seção precisa competir por espaço com
   as outras, e o botão de salvar de cada uma fica sempre visível.
3. **O formulário aberto não some** quando alguém abre outra seção — em
   accordion, fechar a sanfona descarta o rascunho.

Forma canônica (ver `pages/settings/`):

```
pages/<tela>/
  Tela.tsx            → cabeçalho + <SectionNav /> + <Outlet />
  sections/           → uma seção por arquivo, cada uma com seus hooks
router/routes.tsx     → children + { index: true, element: <Navigate .../> }
```

O índice é o `SectionNav` (`compositions/SectionNav`): coluna vertical no
desktop, trilho rolável no celular — mesmo gesto da trilha da fila de
pedidos.

## Quando usar cada peça

| Situação | Solução |
|---|---|
| Seções independentes, cada uma com seu salvar | sub-rotas + `SectionNav` |
| Alternar entre visões do **mesmo** dado (fila por etapa) | filtro na própria tela (`StageTrack`) |
| Detalhe de um item da lista | rota filha (`/pedidos/:id`), com `BackLink` |
| Conteúdo secundário, raramente aberto | `Collapsible` do DS, dentro da seção |
| Ação que interrompe o fluxo (confirmar, escolher) | `Modal`/`Drawer` do DS |

Tabs do DS ficam para alternância **rasa** dentro de um painel já curto — não
para dividir tela grande.

## Alvos de toque

Nada clicável abaixo de 44px de altura no celular. O `BackLink`
(`components/BackLink`) já nasce com 44px e texto de 16px; usar ele em toda
tela de detalhe em vez de um `<Link>` solto.

## Conta do usuário não é seção da loja

Dados pessoais, assinatura e sair ficam no menu do rodapé do sidebar
(`layouts/AppLayout/UserMenu`), com rotas próprias (`/minha-conta`,
`/assinatura`). Configurações é sobre a **loja**; o que é da pessoa ou da
empresa não entra lá.

## Sidebar: drawer no celular, collapse no desktop

Tudo mora em `layouts/AppLayout/AppLayout.tsx` — não existem componentes
`AppHeader`/`SideMenu` separados, o hamburguer e a barra de topo ficam
inline no próprio `AppLayout`.

- **Celular** (abaixo de `lg`): `Sidebar` é drawer — `isOpen`/`onClose`
  controlam abertura, com overlay clicável atrás (`.overlay`, some acima de
  `lg`) e trava de scroll do body enquanto aberto. Cada `NavLink` chama
  `onClose` no clique, fechando o drawer ao navegar.
- **Desktop** (`lg`+): drawer não existe mais — a `Sidebar` fica fixa, e
  ganha um modo **collapse** (`collapsed`/`onToggleCollapse`) que reduz pra
  só ícone (`lg:w-[4.75rem]`). O estado do collapse persiste em
  `localStorage` via `utils/sidebar-collapse.ts`
  (`readSidebarCollapsed`/`writeSidebarCollapsed`), não em store — sobrevive
  a reload sem precisar de middleware de persistência no zustand.

Não recriar isso como Context ou store global: `menuOpen`/`collapsed` só
importam pro próprio `AppLayout` e pro `Sidebar` que ele renderiza — nenhuma
tela distante precisa saber se o menu tá aberto (ver `code-style.md`,
"Estado global — zustand, nunca Context Provider").
