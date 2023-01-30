import { PublicKey } from '@solana/web3.js'
import { CancelOrCloseGrantButton, ViewPoWButton } from 'components/GrantButton'
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
  const isMinted = String(grant.nft) !== String(PublicKey.default)

  if (
    grantStatusMapping[grant.senderStatus] === GRANT_STATUS.PENDING &&
    grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.PENDING
  ) {
    return <CancelOrCloseGrantButton grant={grant} type="cancel" />
  }
  if (status === GRANT_STATUS.REJECTED) {
    return <CancelOrCloseGrantButton grant={grant} type="close" />
  }
  if (status === GRANT_STATUS.APPROVED && isMinted) {
    return <ViewPoWButton grant={grant} />
  }
  return <Text className="text-xs italic">{capitalizeFirstLetter(status)}</Text>
}
