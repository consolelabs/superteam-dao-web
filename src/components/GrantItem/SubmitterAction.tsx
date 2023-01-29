import { CancelOrCloseGrantButton } from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'
import { capitalizeFirstLetter } from 'utils/capitalizeFirstLetter'
import { getGrantStatus } from 'utils/grant'

interface Props {
  grant: GrantDetail
}

export const SubmitterAction = ({ grant }: Props) => {
  const status = getGrantStatus(grant)

  if (
    grantStatusMapping[grant.senderStatus] === GRANT_STATUS.PENDING &&
    grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.PENDING
  ) {
    return <CancelOrCloseGrantButton grant={grant} type="cancel" />
  }
  return <Text className="text-xs italic">{capitalizeFirstLetter(status)}</Text>
}
