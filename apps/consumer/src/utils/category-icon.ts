/**
 * Emoji por palavra-chave no nome da categoria — cosmético, não crítico.
 * Sem match, a categoria fica só com o nome (sem ícone quebrado).
 */
const KEYWORD_ICON: [RegExp, string][] = [
  [/lanch|burg|sandu/i, '🍔'],
  [/pizza/i, '🍕'],
  [/bebid|suco|refri|drink/i, '🥤'],
  [/sobremesa|doce|sorvete/i, '🍰'],
  [/salada/i, '🥗'],
  [/sopa|caldo/i, '🍲'],
  [/massa|macarr|lasanha/i, '🍝'],
  [/carne|churrasco|espeto/i, '🍖'],
  [/japon|sushi|temaki/i, '🍣'],
  [/café|padaria|pão/i, '🥐'],
  [/vegan|vegetarian/i, '🥦'],
]

export const categoryIcon = (name: string): string | null =>
  KEYWORD_ICON.find(([pattern]) => pattern.test(name))?.[1] ?? null
