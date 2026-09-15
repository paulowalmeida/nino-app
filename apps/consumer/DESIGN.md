---
name: Nino Consumer
description: Jornada de pedido direta, temática por loja e orientada à decisão.
colors:
  brand: "#ff6b00"
  brand-strong: "#e8540c"
  page: "#ffffff"
  raised: "#ffffff"
  ink-strong: "#645e56"
  ink-default: "#777067"
  ink-muted: "#898178"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
  body:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  field: "8px"
  card: "16px"
  action: "9999px"
spacing:
  compact: "8px"
  base: "16px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.page}"
    rounded: "{rounded.action}"
    height: "48px"
    padding: "0 24px"
  input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.field}"
    height: "44px"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink-default}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: Nino Consumer

## Overview

**Creative North Star: "Passagem de cozinha"**

O consumer conduz o cliente por decisões claras, sem aparência administrativa. A identidade vem da unidade escolhida; a estrutura permanece previsível entre lojas.

**Key Characteristics:**

- Marca aplicada a seleção, foco, progresso e ação principal.
- Superfícies claras, quentes e contidas por bordas sutis.
- Hierarquia curta, linguagem direta e total sempre conferível.

## Colors

A paleta padrão é quente e neutra. Cada loja pode substituir marca, superfícies, texto e bordas pelos tokens semânticos, sem alterar componentes.

**The Unit Palette Rule.** Nunca codifique a cor da unidade dentro de uma tela; use os papéis semânticos do tema.

**The Focused Brand Rule.** A marca indica escolha, foco, progresso e ação — não colore áreas grandes sem função.

## Typography

**Display Font:** Bricolage Grotesque, com fallback sans-serif  
**Body Font:** Hanken Grotesk, com fallback sans-serif

Títulos são compactos, pesados e humanos; texto funcional é neutro e altamente legível.

**The Short Hierarchy Rule.** Use display apenas em títulos e valores decisivos; corpo e rótulos permanecem em Hanken Grotesk.

## Layout

O ritmo parte de 8px. No mobile, a etapa ocupa a tela, o resumo aparece apenas na revisão e uma barra compacta de ações adere ao rodapé. A partir de 1024px, a etapa ocupa a coluna principal e o resumo permanece aderente à direita, dentro de um contêiner máximo de 1280px.

## Elevation & Depth

O sistema é plano por padrão. Bordas e contraste tonal criam separação; sombra difusa aparece somente na barra móvel que precisa se destacar do conteúdo rolável.

**The Flat by Default Rule.** Cartões em repouso usam borda, não sombra ornamental.

## Shapes

Campos usam cantos discretos de 8px, agrupamentos usam 16px e ações primárias são totalmente arredondadas. A diferença de raio comunica função, não decoração.

## Components

### Buttons

Botão primário preenchido pela marca, altura entre 44px e 48px, foco visível e compressão leve no estado ativo. Ações secundárias usam contorno ou superfície neutra.

### Cards / Containers

Superfície elevada, borda semântica de 1px e raio de 16px. O padding varia de 16px no mobile a 24px em telas maiores.

### Inputs / Fields

Superfície elevada, borda de marca diluída em repouso e marca cheia com anel interno no foco. Erro troca borda e anel para o papel de perigo.

### Navigation

Fluxos de conclusão usam progresso numerado. Apenas etapas concluídas podem ser revisitadas; a etapa atual recebe marca e `aria-current="step"`.

## Do's and Don'ts

### Do:

- **Do** mantenha total e ação principal acessíveis durante o checkout.
- **Do** valide cada etapa antes do avanço e preserve os dados ao voltar.
- **Do** use os componentes do Nino DS antes de criar variações locais.

### Don't:

- **Don't** transforme o checkout em um formulário contínuo longo.
- **Don't** use cor de marca como preenchimento decorativo sem estado associado.
- **Don't** misture cartões com sombras, bordas e efeitos concorrentes.
