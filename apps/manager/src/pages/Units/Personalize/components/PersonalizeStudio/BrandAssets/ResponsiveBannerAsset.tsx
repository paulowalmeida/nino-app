import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FileUpload } from '@nino/ds/components/FileUpload'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { PhotoCropper } from '@shared/components/PhotoCropper/PhotoCropper'
import type { CropArea } from '@shared/types/ui/crop-area'
import type {
  BannerCrops,
  BannerVariantFiles,
  BannerVariants,
} from '@pages/Units/types/BannerCrop.type'
import { BANNER_CROP_PRESETS } from '@pages/Units/types/BannerCrop.type'
import type { UnitDraft } from '@shared/types/store/unit-draft'

type ResponsiveBannerAssetProps = {
  hasAsset: boolean
  crops?: BannerCrops
  variants?: BannerVariants
  onChange: (
    change: Pick<
      UnitDraft,
      'bannerFile' | 'bannerCrops' | 'bannerVariantFiles' | 'bannerVariants'
    >
  ) => void
  onRemove: () => void
}

const IMAGE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
}

const MAX_FILE_SIZE = 4 * 1024 * 1024

export const ResponsiveBannerAsset = ({
  hasAsset,
  crops: initialCrops,
  variants = {},
  onChange,
  onRemove,
}: ResponsiveBannerAssetProps) => {
  const [source, setSource] = useState<File | null>(null)
  const [crops, setCrops] = useState<BannerCrops>(initialCrops ?? {})
  const [variantFiles, setVariantFiles] = useState<BannerVariantFiles>({})
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex === null ? null : BANNER_CROP_PRESETS[activeIndex]

  const saveCrop = (area: CropArea) => {
    if (!source || !active || activeIndex === null) return
    const nextCrops = { ...crops, [active.id]: area }
    setCrops(nextCrops)
    onChange({ bannerFile: source, bannerCrops: nextCrops })
    setActiveIndex(
      activeIndex + 1 < BANNER_CROP_PRESETS.length ? activeIndex + 1 : null
    )
  }

  const chooseVariant = (
    id: (typeof BANNER_CROP_PRESETS)[number]['id'],
    file: File
  ) => {
    const nextFiles = { ...variantFiles, [id]: file }
    setVariantFiles(nextFiles)
    onChange({ bannerVariantFiles: nextFiles })
  }

  const clearVariant = (id: (typeof BANNER_CROP_PRESETS)[number]['id']) => {
    const nextFiles = { ...variantFiles }
    delete nextFiles[id]
    const nextVariants = { ...variants }
    delete nextVariants[id]
    setVariantFiles(nextFiles)
    onChange({ bannerVariantFiles: nextFiles, bannerVariants: nextVariants })
  }

  return (
    <>
      <FormField
        label="Banner responsivo"
        helperText="Use uma arte-fonte com recortes ou substitua apenas as faixas que merecem uma arte própria."
      >
        <Box className="flex flex-col items-start gap-3">
          <FileUpload
            accept={IMAGE_TYPES}
            maxFileSize={MAX_FILE_SIZE}
            triggerLabel={
              hasAsset ? 'Trocar arte-fonte' : 'Escolher arte-fonte'
            }
            onFileChange={(files) => {
              const file = files[0]
              if (!file) return
              setSource(file)
              setCrops({})
              setActiveIndex(0)
            }}
          />
          {hasAsset && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remover banner
            </Button>
          )}
          {(source || Object.keys(crops).length > 0 || hasAsset) && (
            <Box className="flex w-full flex-col gap-2">
              {BANNER_CROP_PRESETS.map((preset, index) => (
                <Box
                  key={preset.id}
                  direction="row"
                  align="center"
                  justify="between"
                  gap={2}
                  className="flex-wrap rounded-3 border border-border px-3 py-2"
                >
                  <Text size="sm" weight="semibold">
                    {preset.label}
                  </Text>
                  <Box direction="row" align="center" gap={2} wrap>
                    <Button
                      variant={crops[preset.id] ? 'outline' : 'ghost'}
                      size="sm"
                      disabled={!source}
                      onClick={() => setActiveIndex(index)}
                    >
                      {crops[preset.id] ? 'Ajustar recorte' : 'Definir recorte'}
                    </Button>
                    <FileUpload
                      accept={IMAGE_TYPES}
                      maxFileSize={MAX_FILE_SIZE}
                      triggerLabel={
                        variantFiles[preset.id] || variants[preset.id]
                          ? 'Trocar arte'
                          : 'Outra arte'
                      }
                      onFileChange={(files) => {
                        const file = files[0]
                        if (file) chooseVariant(preset.id, file)
                      }}
                    />
                    {(variantFiles[preset.id] || variants[preset.id]) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearVariant(preset.id)}
                      >
                        Usar original
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </FormField>

      <Modal
        open={!!(source && active)}
        size="lg"
        onOpenChange={(open) => !open && setActiveIndex(null)}
        header={
          <Heading level={2} size="lg">
            {active ? `Enquadrar: ${active.label}` : 'Enquadrar banner'}
          </Heading>
        }
        body={
          source && active ? (
            <PhotoCropper
              key={`${source.name}-${active.id}`}
              file={source}
              isSending={false}
              framed={false}
              aspectRatio={active.aspectRatio}
              initialArea={crops[active.id]}
              hint="Arraste e use o zoom. Este é exatamente o recorte que aparecerá nessa largura."
              confirmLabel={
                activeIndex === BANNER_CROP_PRESETS.length - 1
                  ? 'Concluir enquadramentos'
                  : 'Salvar e ir para a próxima'
              }
              onConfirm={() => undefined}
              onConfirmArea={saveCrop}
              onCancel={() => setActiveIndex(null)}
            />
          ) : null
        }
      />
    </>
  )
}
