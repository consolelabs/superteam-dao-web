import { grantStatusMapping } from 'constants/grant'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const SenderAction = ({ grant }: Props) => {
  switch (grantStatusMapping[grant.senderStatus]) {
    default:
      return null
  }
}
