import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'

export const getGrantStatus = (grant: GrantDetail) => {
  if (
    grantStatusMapping[grant.senderStatus] === GRANT_STATUS.REJECTED ||
    grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.REJECTED
  ) {
    return GRANT_STATUS.REJECTED
  }
  if (
    grantStatusMapping[grant.senderStatus] === GRANT_STATUS.APPROVED &&
    grantStatusMapping[grant.receiverStatus] === GRANT_STATUS.APPROVED
  ) {
    return GRANT_STATUS.APPROVED
  }
  return GRANT_STATUS.PENDING
}
