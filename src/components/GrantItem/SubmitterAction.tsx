import { CancelOrCloseGrantButton } from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const SubmitterAction = ({ grant }: Props) => {
  if (
    grantStatusMapping[grant.senderStatus] === GRANT_STATUS.PENDING &&
    grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.PENDING
  ) {
    return <CancelOrCloseGrantButton grant={grant} type="cancel" />
  }
  return <Text className="text-xs italic">Pending</Text>
}
