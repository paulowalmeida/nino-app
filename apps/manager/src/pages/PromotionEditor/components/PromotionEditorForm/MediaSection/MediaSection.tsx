import { useState } from 'react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { FileUpload } from '@nino/ds/components/FileUpload'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Modal } from '@nino/ds/components/Modal'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { PhotoCropper } from '@shared/components/PhotoCropper/PhotoCropper'
import { useObjectUrl } from '@shared/hooks/ui/useObjectUrl/useObjectUrl'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import styles from './MediaSection.module.css'

const CAMPAIGN_BANNER_ASPECT_RATIO = 16 / 7

export const MediaSection = () => {
  const { control, getValues, setValue } = useFormContext<PromotionFormValues>()
  const [chosenFile, setChosenFile] = useState<File | null>(null)
  const [dropzoneKey, setDropzoneKey] = useState(0)
  const imageUrl = useWatch({ control, name: 'imageUrl' })
  const imageFile = useWatch({ control, name: 'imageFile' })
  const removeImage = useWatch({ control, name: 'removeImage' })
  const currentImageUrl = removeImage ? null : imageUrl
  const imageFileUrl = useObjectUrl(imageFile ?? undefined)
  const currentImage =
    imageFileUrl ??
    (currentImageUrl ? resolveApiAssetUrl(currentImageUrl) : null)

  const closeCropper = () => {
    setChosenFile(null)
    setDropzoneKey((current) => current + 1)
  }

  const uploadControl = (
    <Controller
      name="imageFile"
      control={control}
      render={() => (
        <FileUpload
          key={dropzoneKey}
          accept={{
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
          }}
          maxFileSize={4 * 1024 * 1024}
          showFileList={false}
          compact={!!currentImage}
          triggerLabel={currentImage ? 'Trocar imagem' : 'Escolher imagem'}
          onFileChange={(files) => setChosenFile(files[0] ?? null)}
        />
      )}
    />
  )

  return (
    <Box as="section" aria-labelledby="campaign-media">
      <Card variant="flat" padding="lg" className={styles.mediaSection}>
        <Heading level={2} size="sm" id="campaign-media">
          Imagem da campanha
        </Heading>

        {currentImage && (
          <Box className={styles.currentImage}>
            <Image
              src={currentImage}
              alt="Prévia da imagem da campanha"
              className={styles.preview}
              wrapperClassName={styles.previewWrap}
            />
            <Box direction="row" className={styles.imageActions}>
              {uploadControl}
              <button
                type="button"
                className={styles.imageAction}
                onClick={() => {
                  setValue('removeImage', true, { shouldDirty: true })
                  setValue('imageFile', null, { shouldDirty: true })
                  setValue('showInBanner', false, { shouldDirty: true })
                }}
              >
                Remover imagem
              </button>
            </Box>
          </Box>
        )}

        {!currentImage && uploadControl}
        <Text size="sm" color="muted">
          Aceita qualquer resolução; no carrossel, a imagem aparece em 16:7
          (recomendado: 1200 × 525 px).
        </Text>

        <Controller
          name="showInBanner"
          control={control}
          rules={{
            validate: (show) =>
              !show ||
              !!getValues('imageFile') ||
              (!!getValues('imageUrl') && !getValues('removeImage')) ||
              'Envie uma imagem para colocar a campanha no carrossel',
          }}
          render={({ field }) => (
            <FormField
              label="Mostrar no carrossel do cardápio"
              helperText="A campanha entra junto do banner da loja."
              orientation="horizontal"
            >
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Mostrar campanha no carrossel"
              />
            </FormField>
          )}
        />
      </Card>
      <Modal
        open={!!chosenFile}
        size="lg"
        onOpenChange={(isOpen) => {
          if (!isOpen) closeCropper()
        }}
        header={
          <Heading level={2} size="lg">
            Ajustar banner da campanha
          </Heading>
        }
        body={
          chosenFile && (
            <PhotoCropper
              key={`${chosenFile.name}-${chosenFile.size}`}
              file={chosenFile}
              isSending={false}
              framed={false}
              aspectRatio={CAMPAIGN_BANNER_ASPECT_RATIO}
              hint="Arraste o recorte para posicionar. Use o zoom abaixo para ajustar a aproximação."
              confirmLabel="Usar este recorte"
              onConfirm={(edited) => {
                setValue('imageFile', edited, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                setValue('removeImage', false, { shouldDirty: true })
                closeCropper()
              }}
              onCancel={closeCropper}
            />
          )
        }
      />
    </Box>
  )
}
