import {
  ApproveAndRejectGrantButton,
  CancelOrCloseGrantButton,
  MintPoWButton,
} from 'components/GrantButton'
import { EnterPoPButton, ViewPoPButton } from 'components/PoPButton'
import { Text } from 'components/Text'
import {
  grantStatusMapping,
  GRANT_STATUS,
  popStatusMapping,
  POP_STATUS,
} from 'constants/grant'
import { ProposalFields } from 'idl/accounts'

interface RecipientActionProps {
  grant: ProposalFields
}

export const RecipientAction = ({ grant }: RecipientActionProps) => {
  switch (grantStatusMapping[grant.status]) {
    case GRANT_STATUS.PENDING: {
      return <ApproveAndRejectGrantButton grant={grant} />
    }
    case GRANT_STATUS.REJECTED: {
      return <CancelOrCloseGrantButton type="close" grant={grant} />
    }
    case GRANT_STATUS.APPROVED: {
      switch (grant.owner) {
        case true: {
          if (!grant.transaction) {
            return <EnterPoPButton grant={grant} />
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.REJECTED) {
            return <Text className="text-xs italic">PoP rejected</Text>
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.CONFIRMED) {
            return <Text className="text-xs italic">PoP approved</Text>
          }
          return (
            <Text className="text-xs italic">Waiting for PoP confirmation</Text>
          )
        }
        case false: {
          if (!grant.transaction) {
            return <Text className="text-xs italic">Waiting for PoP</Text>
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.REJECTED) {
            return <Text className="text-xs italic">PoP rejected</Text>
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.PENDING) {
            return <ViewPoPButton grant={grant} />
          }
          return <MintPoWButton grant={grant} />
        }
        default:
          return null
      }
    }
    default:
      return null
  }
}
