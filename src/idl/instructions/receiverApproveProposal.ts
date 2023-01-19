import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ReceiverApproveProposalAccounts {
  proposal: PublicKey
  receiver: PublicKey
  systemProgram: PublicKey
}

export function receiverApproveProposal(
  accounts: ReceiverApproveProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([125, 48, 169, 18, 29, 145, 181, 163])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
