import {
  ApproveAndRejectGrantButton,
  CancelOrCloseGrantButton,
  MintPoWButton,
} from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'
import { getGrantStatus } from 'utils/grant'

interface Props {
  grant: GrantDetail
}

export const ReceiverAction = ({ grant }: Props) => {
  switch (getGrantStatus(grant)) {
    case GRANT_STATUS.REJECTED: {
      return <CancelOrCloseGrantButton grant={grant} type="close" />
    }
    case GRANT_STATUS.APPROVED: {
      return <MintPoWButton grant={grant} />
    }
    case GRANT_STATUS.PENDING: {
      if (grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.PENDING) {
        return <ApproveAndRejectGrantButton grant={grant} type="receiver" />
      }
      return <Text className="text-xs italic">Waiting for approval</Text>
    }
    default:
      return null
  }
}
