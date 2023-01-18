import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface SenderRejectProposalAccounts {
  proposal: PublicKey
  sender: PublicKey
  systemProgram: PublicKey
}

export function senderRejectProposal(accounts: SenderRejectProposalAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.sender, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([238, 130, 35, 164, 66, 254, 220, 46])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
