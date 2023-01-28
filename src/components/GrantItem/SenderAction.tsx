import {
  ApproveAndRejectGrantButton,
  CancelOrCloseGrantButton,
} from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const SenderAction = ({ grant }: Props) => {
  switch (grantStatusMapping[grant.senderStatus]) {
    case GRANT_STATUS.PENDING: {
      return <ApproveAndRejectGrantButton grant={grant} type="sender" />
    }
    case GRANT_STATUS.REJECTED: {
      return <CancelOrCloseGrantButton grant={grant} type="close" />
    }
    case GRANT_STATUS.APPROVED: {
      switch (grantStatusMapping[grant.receiverStatus]) {
        case GRANT_STATUS.PENDING: {
          return (
            <>
              <Text className="text-xs italic">Waiting for approval</Text>
              <CancelOrCloseGrantButton grant={grant} type="cancel" />
            </>
          )
        }
        case GRANT_STATUS.REJECTED: {
          return (
            <>
              <Text className="text-xs italic">Receiver rejected</Text>
              <CancelOrCloseGrantButton grant={grant} type="cancel" />
            </>
          )
        }
        case GRANT_STATUS.APPROVED: {
          return <Text className="text-xs italic">Receiver approved</Text>
        }
        default:
          return null
      }
    }
    default:
      return null
  }
}