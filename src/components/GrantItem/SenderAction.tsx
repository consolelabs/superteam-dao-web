import {
  ApproveAndRejectGrantButton,
  CancelOrCloseGrantButton,
} from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'
import { getGrantStatus } from 'utils/grant'

interface Props {
  grant: GrantDetail
}

export const SenderAction = ({ grant }: Props) => {
  switch (getGrantStatus(grant)) {
    case GRANT_STATUS.REJECTED: {
      return <CancelOrCloseGrantButton grant={grant} type="close" />
    }
    case GRANT_STATUS.APPROVED: {
      return <Text className="text-xs italic">Approved</Text>
    }
    case GRANT_STATUS.PENDING: {
      if (grantStatusMapping[grant.senderStatus] === GRANT_STATUS.PENDING) {
        return <ApproveAndRejectGrantButton grant={grant} type="sender" />
      }
      return <Text className="text-xs italic">Waiting for approval</Text>
    }

    default:
      return null
  }
}
