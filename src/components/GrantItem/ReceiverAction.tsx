import { grantStatusMapping } from 'constants/grant'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const ReceiverAction = ({ grant }: Props) => {
  switch (grantStatusMapping[grant.receiverStatus]) {
    default:
      return null
  }
}
