import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface CreateIdentifierAccounts {
  identifier: PublicKey
  sender: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export function createIdentifier(accounts: CreateIdentifierAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.identifier, isSigner: false, isWritable: true },
    { pubkey: accounts.sender, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([130, 90, 201, 229, 31, 92, 59, 112])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
