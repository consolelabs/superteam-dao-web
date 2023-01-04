import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ApproveProposalArgs {
  transactionHash: string | null
}

export interface ApproveProposalAccounts {
  proposal: PublicKey
  recipient: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.option(borsh.str(), 'transactionHash'),
])

export function approveProposal(
  args: ApproveProposalArgs,
  accounts: ApproveProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.recipient, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([136, 108, 102, 85, 98, 114, 7, 147])
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
