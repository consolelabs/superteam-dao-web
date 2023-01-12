import { PublicKey } from '@solana/web3.js'
import { ProposalFields } from 'idl/accounts'

export interface GrantAmount {
  amount?: number | string
  token?: string
}

export type GrantDetail = ProposalFields & {
  account?: PublicKey
}
