import { PublicKey } from '@solana/web3.js'
import {
  ApproveAndRejectGrantButton,
  CancelOrCloseGrantButton,
  ViewPoWButton,
} from 'components/GrantButton'
import { Text } from 'components/Text'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'
import { getGrantStatus } from 'utils/grant'

interface Props {
  grant: GrantDetail
}

export const SenderAction = ({ grant }: Props) => {
  const isMinted = String(grant.nft) !== String(PublicKey.default)

  switch (getGrantStatus(grant)) {
    case GRANT_STATUS.REJECTED: {
      return <CancelOrCloseGrantButton grant={grant} type="close" />
    }
    case GRANT_STATUS.APPROVED: {
      return isMinted ? (
        <ViewPoWButton grant={grant} />
      ) : (
        <Text className="text-xs italic">Waiting for PoW</Text>
      )
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
