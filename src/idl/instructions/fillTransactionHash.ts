import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface FillTransactionHashArgs {
  transactionHash: string | null
}

export interface FillTransactionHashAccounts {
  proposal: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.option(borsh.str(), 'transactionHash'),
])

export function fillTransactionHash(
  args: FillTransactionHashArgs,
  accounts: FillTransactionHashAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([81, 84, 87, 69, 20, 113, 70, 244])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      transactionHash: args.transactionHash,
    },
    buffer,
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
