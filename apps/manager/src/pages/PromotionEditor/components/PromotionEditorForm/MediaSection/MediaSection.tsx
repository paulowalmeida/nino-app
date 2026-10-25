import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { FileUpload } from '@nino/ds/components/FileUpload'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Switch } from '@nino/ds/components/Switch'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import styles from './MediaSection.module.css'

export const MediaSection = () => {
  const { control, getValues, setValue } = useFormContext<PromotionFormValues>()
  const imageUrl = useWatch({ control, name: 'imageUrl' })
  const imageFile = useWatch({ control, name: 'imageFile' })
  const removeImage = useWatch({ control, name: 'removeImage' })
  const currentImageUrl = removeImage ? null : imageUrl

  return (
    <Box as="section" aria-labelledby="campaign-media">
      <Card variant="flat" padding="lg" className={styles.mediaSection}>
        <Heading level={2} size="sm" id="campaign-media">
          Imagem da campanha
        </Heading>

        {currentImageUrl && !imageFile && (
          <Box className={styles.currentImage}>
            <Image
              src={resolveApiAssetUrl(currentImageUrl)}
              alt="Imagem atual da campanha"
              className={styles.preview}
              wrapperClassName={styles.previewWrap}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setValue('removeImage', true, { shouldDirty: true })
                setValue('showInBanner', false, { shouldDirty: true })
              }}
            >
              Remover imagem
            </Button>
          </Box>
        )}

        <Controller
          name="imageFile"
          control={control}
          render={({ field }) => (
            <FileUpload
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
              }}
              maxFileSize={4 * 1024 * 1024}
              triggerLabel={
                currentImageUrl ? 'Trocar imagem' : 'Escolher imagem'
              }
              onFileChange={(files) => {
                field.onChange(files[0] ?? null)
                if (files[0]) setValue('removeImage', false)
              }}
            />
          )}
        />

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
    </Box>
  )
}
