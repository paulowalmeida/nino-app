import type { NinoMascotProps } from "./NinoMascot.types"

export function NinoMascot({ className }: NinoMascotProps) {
  // ilustração estática decorativa — SVG não passa pela otimização do
  // next/image, então <img> é apropriado aqui
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mascot-manager.svg"
      alt="Mascote Nino"
      className={className}
    />
  )
}
