import { useDisclosure } from '@dwarvesf/react-hooks'
import { Button } from 'components/Button'
import { Text } from 'components/Text'
import {
  grantStatusMapping,
  GRANT_STATUS,
  popStatusMapping,
  POP_STATUS,
} from 'constants/grant'
import { useGrantActions } from 'hooks/useGrantActions'
import { ProposalFields } from 'idl/accounts'
import { PoPModal } from './PoPModal'

interface RecipientActionProps {
  grant: ProposalFields
}

export const RecipientAction = ({ grant }: RecipientActionProps) => {
  const {
    isOpen: isOpenPoPModal,
    onClose: onClosePoPModal,
    onOpen: onOpenPoPModal,
  } = useDisclosure()
  const { approveGrant, rejectGrant, closeGrant } = useGrantActions(grant)

  switch (grantStatusMapping[grant.status]) {
    case GRANT_STATUS.PENDING: {
      switch (grant.owner) {
        case true: {
          return (
            <>
              <Button
                appearance="link"
                size="md"
                className="text-purple-600"
                onClick={approveGrant}
              >
                Approve
              </Button>
              {' / '}
              <Button
                appearance="link"
                size="md"
                className="text-purple-600"
                onClick={rejectGrant}
              >
                Reject
              </Button>
            </>
          )
        }
        case false:
        default:
          return null
      }
    }
    case GRANT_STATUS.REJECTED: {
      return (
        <Button
          appearance="link"
          size="md"
          className="text-purple-600"
          onClick={closeGrant}
        >
          Close
        </Button>
      )
    }
    case GRANT_STATUS.APPROVED: {
      switch (grant.owner) {
        case true: {
          if (!grant.transaction) {
            return (
              <>
                <Button
                  appearance="link"
                  size="md"
                  className="text-purple-600"
                  onClick={onOpenPoPModal}
                >
                  Enter PoP
                </Button>
                {isOpenPoPModal && (
                  <PoPModal
                    isOpen={isOpenPoPModal}
                    onClose={onClosePoPModal}
                    grant={grant}
                  />
                )}
              </>
            )
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
        case false:
        default:
          return null
      }
    }
    default:
      return null
  }
}
