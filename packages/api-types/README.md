# @nino/api-types

Types da `nino-api` gerados a partir do OpenAPI, via `openapi-typescript`.

## Regenerar

Com a API dev no ar (`npm run start:dev` na `nino-api`):

```bash
npm run generate --workspace @nino/api-types
```

Aponta para outra instância com `NINO_API_URL=https://... npm run generate ...`.

## Estado atual (2026-07-17)

O documento hoje descreve **só os paths** — os 61 schemas saem vazios
(`Record<string, never>`) e nenhuma resposta declara `content`. Causa: a API não
liga o `@nestjs/swagger/plugin` no `nest-cli.json` (que infere as propriedades
dos DTOs a partir dos types e do class-validator) e os types de resposta são
`type` aliases, que o plugin não enxerga.

Enquanto isso não é corrigido do lado da API, os apps escrevem à mão os types de
payload que consomem. Quando a anotação chegar, regerar aqui e trocar os types
manuais por estes.
