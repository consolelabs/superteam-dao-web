import { Button } from 'components/Button'
import { Text } from 'components/Text'
import {
  grantStatusMapping,
  GRANT_STATUS,
  popStatusMapping,
  POP_STATUS,
} from 'constants/grant'
import { useGrantActions } from 'hooks/useGrantActions'
import { GrantDetail } from 'types/grant'

interface SenderActionProps {
  grant: GrantDetail
}

export const SenderAction = ({ grant }: SenderActionProps) => {
  const { cancelGrant, closeGrant, approvePoP, rejectPoP } =
    useGrantActions(grant)

  switch (grantStatusMapping[grant.status]) {
    case GRANT_STATUS.PENDING: {
      return (
        <>
          <Text className="text-xs italic">Waiting for approval</Text>
          <Button
            appearance="link"
            size="md"
            className="text-purple-600"
            onClick={cancelGrant}
          >
            Cancel
          </Button>
        </>
      )
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
            return <Text className="text-xs italic">Waiting for PoP</Text>
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.REJECTED) {
            return <Text className="text-xs italic">PoP rejected</Text>
          }
          if (popStatusMapping[grant.popStatus] === POP_STATUS.PENDING) {
            return (
              <>
                <Button
                  appearance="link"
                  size="md"
                  className="text-purple-600"
                  onClick={approvePoP}
                >
                  Approve PoP
                </Button>
                {' / '}
                <Button
                  appearance="link"
                  size="md"
                  className="text-purple-600"
                  onClick={rejectPoP}
                >
                  Reject PoP
                </Button>
              </>
            )
          }
          return (
            <Button appearance="link" size="md" className="text-purple-600">
              Mint PoW
            </Button>
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
