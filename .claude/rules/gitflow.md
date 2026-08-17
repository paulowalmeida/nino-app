# GitFlow e commits

## Branches

- `main` = produção · `develop` = integração
- **feature** (`feat/NAPP-XX`) sai de `develop` e faz merge de volta em
  `develop`. Nunca brancar feature de `main` nem encadear feature sobre feature
- **hotfix** sai de `main`; **release** sai de `develop` → `main` (ignorar
  release na fase atual de desenvolvimento)
- Antes de implementar: `git checkout develop && git pull`, depois
  `git checkout -b feat/...`

## Commits

- Commits pequenos e frequentes — por componente ou grupo coeso de mudanças,
  nunca acumular uma sessão inteira num único commit
- Commits e PRs descrevem só a mudança técnica
- Sem `Co-Authored-By`, sem assinatura ou crédito de ferramenta em qualquer
  artefato versionado
