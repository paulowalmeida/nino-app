import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { CollaboratorContact } from '@molecules/CollaboratorContact/CollaboratorContact'
import { CollaboratorHeader } from '@organisms/CollaboratorHeader/CollaboratorHeader'
import { CollaboratorSummary } from '@organisms/CollaboratorSummary/CollaboratorSummary'
import type { StaffDetail } from '@custom_types/team/staff-detail'

type CollaboratorHeaderContainerProps = {
  member: StaffDetail
}

export const CollaboratorHeaderContainer = ({
  member,
}: CollaboratorHeaderContainerProps) => (
  <>
    <Breadcrumb
      trail={[{ label: 'Equipe', to: '..' }, { label: member.user.name }]}
    />

    <CollaboratorHeader member={member} />

    <CollaboratorSummary member={member} />

    <CollaboratorContact member={member} />
  </>
)
