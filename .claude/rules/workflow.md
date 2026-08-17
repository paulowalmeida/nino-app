# Fluxo de trabalho

Hábitos de processo — não são convenção de código, são como conduzir a
tarefa do início ao fim nas telas do `manager` (e demais apps do monorepo).

## Pedir pro Paulo confirmar o visual, não sair validando sozinho

Mudança em tela (nova página, ajuste de layout, skeleton, animação) não
está concluída só porque `build`/`lint`/`test` passam. Esses três verificam
correção de código, não verificam se a tela ficou como deveria — mas quem
confere isso é o Paulo olhando, **não** uma rodada de browser automation.

Antes de reportar como concluído:

1. Se o ajuste depende de um estado difícil de alcançar no código (loading,
   erro, vazio), forçar esse estado (`if (isPending || true) return ...`)
   só o suficiente pra garantir que compila/renderiza, e reverter antes de
   entregar.
2. **Perguntar, não assumir**: algo como "posso confirmar o visual ou você
   faz isso?" — nunca sair direto pro browser automation por conta própria,
   e nunca simplesmente declarar "confirme o visual" sem oferecer a opção
   de ele mesmo olhar. É pergunta de escolha, não aviso.

**Why:** ferramenta automatizada (typecheck, lint, teste) não pega
diferença de espaçamento, alinhamento quebrado, elemento faltando ou
animação ausente — mas gastar chamadas de browser automation pra fazer o
que o Paulo confirma em 2 segundos olhando é desperdício de token.

## Lint obrigatório antes de entregar

Rodar lint (`npx eslint <arquivo>` ou o script do app) e corrigir **todos**
os erros antes de reportar qualquer arquivo como concluído — não deixar pra
quem revisar achar. Erros comuns: `isNaN` global (usar `Number.isNaN`) e
formatação (rodar com `--fix` em vez de ajustar espaço na mão).

Estratégia de construção de skeleton de tela: ver `components.md`.
