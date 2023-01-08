export const GRANT_STATUS = {
  PENDING: 'pending',
  CANCELED: 'canceled',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const grantStatusMapping: Record<number, string> = {
  0: GRANT_STATUS.PENDING,
  1: GRANT_STATUS.CANCELED,
  2: GRANT_STATUS.APPROVED,
  3: GRANT_STATUS.REJECTED,
}
