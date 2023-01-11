import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ApplicantConfirmProposalAccounts {
  proposal: PublicKey
  applicant: PublicKey
  systemProgram: PublicKey
}

export function applicantConfirmProposal(
  accounts: ApplicantConfirmProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.applicant, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([193, 7, 118, 205, 60, 0, 227, 174])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
