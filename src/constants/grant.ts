export const GRANT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
}

export const grantStatusMapping: Record<number, string> = {
  0: GRANT_STATUS.PENDING,
  1: GRANT_STATUS.APPROVED,
  2: GRANT_STATUS.REJECTED,
  3: GRANT_STATUS.CANCELED,
}
