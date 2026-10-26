import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'
import type { UnitPhone } from '@shared/types/settings/unit-phone'
import { formatPhone } from '@shared/utils/phone/phone'

import { PhoneForm } from './PhoneForm/PhoneForm'
import { PhoneList } from './PhoneList/PhoneList'
import { RemovePhoneModal } from './RemovePhoneModal/RemovePhoneModal'

import motion from '@styles/motion.module.css'
import local from './SettingsContactSection.module.css'

export const SettingsContactSection = () => {
  const { contact } = useSettingsFacade()
  const { phones, isPending } = contact.query
  const { add, edit, drop } = contact.mutations
  const [removingPhone, setRemovingPhone] = useState<UnitPhone | null>(null)

  const confirmRemoval = () => {
    if (!removingPhone) return
    drop.mutate(removingPhone.id)
    setRemovingPhone(null)
  }

  return (
    <Box as="section" className={local.settingsContactSectionPanel}>
      <Header
        className={`${motion.deal} ${local.head}`}
        level={2}
        size="xl"
        title="Contato"
        description="Cadastre os números que os clientes podem usar para falar com você."
      />

      <PhoneForm isAdding={add.isPending} onAdd={add.mutate} />
      <PhoneList
        phones={phones}
        isPending={isPending}
        onEdit={edit.mutate}
        onRemove={setRemovingPhone}
      />
      <RemovePhoneModal
        open={!!removingPhone}
        onOpenChange={(open) => !open && setRemovingPhone(null)}
        phone={removingPhone ? formatPhone(removingPhone.phone) : ''}
        onConfirm={confirmRemoval}
      />
    </Box>
  )
}
