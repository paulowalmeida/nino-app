import { CADASTRO_URL } from "@/config"

export const columns = [
  {
    title: "Produto",
    links: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Demonstração", href: "#demo" },
      { label: "Preços", href: "#precos" },
      { label: "Criar minha loja", href: CADASTRO_URL },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Cases", href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "WhatsApp", href: "#" },
      { label: "Status do sistema", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
]
