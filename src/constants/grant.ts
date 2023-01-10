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

export const POP_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
}

export const popStatusMapping: Record<number, string> = {
  0: POP_STATUS.PENDING,
  1: POP_STATUS.CONFIRMED,
  2: POP_STATUS.REJECTED,
}
