import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ReceiverRejectProposalAccounts {
  proposal: PublicKey
  receiver: PublicKey
  systemProgram: PublicKey
}

export function receiverRejectProposal(
  accounts: ReceiverRejectProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([69, 162, 197, 69, 63, 240, 200, 108])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
