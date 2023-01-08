import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface CreateProposalArgs {
  recipient: PublicKey
  image: string
  title: string
  subtitle: string
  spl: PublicKey
  tags: string
  amount: BN
  isOwner: boolean
}

export interface CreateProposalAccounts {
  proposal: PublicKey
  identifier: PublicKey
  sender: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey('recipient'),
  borsh.str('image'),
  borsh.str('title'),
  borsh.str('subtitle'),
  borsh.publicKey('spl'),
  borsh.str('tags'),
  borsh.u64('amount'),
  borsh.bool('isOwner'),
])

export function createProposal(
  args: CreateProposalArgs,
  accounts: CreateProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.identifier, isSigner: false, isWritable: true },
    { pubkey: accounts.sender, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([132, 116, 68, 174, 216, 160, 198, 22])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      recipient: args.recipient,
      image: args.image,
      title: args.title,
      subtitle: args.subtitle,
      spl: args.spl,
      tags: args.tags,
      amount: args.amount,
      isOwner: args.isOwner,
    },
    buffer,
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
