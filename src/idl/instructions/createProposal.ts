import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface CreateProposalArgs {
  firstTxn: string
  secondTxn: string
  thirdTxn: string
  sender: PublicKey
  receiver: PublicKey
  image: string
  title: string
  subtitle: string
  spl: PublicKey
  tags: string
  amount: BN
}

export interface CreateProposalAccounts {
  proposal: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.str('firstTxn'),
  borsh.str('secondTxn'),
  borsh.str('thirdTxn'),
  borsh.publicKey('sender'),
  borsh.publicKey('receiver'),
  borsh.str('image'),
  borsh.str('title'),
  borsh.str('subtitle'),
  borsh.publicKey('spl'),
  borsh.str('tags'),
  borsh.u64('amount'),
])

export function createProposal(
  args: CreateProposalArgs,
  accounts: CreateProposalAccounts,
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([132, 116, 68, 174, 216, 160, 198, 22])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      firstTxn: args.firstTxn,
      secondTxn: args.secondTxn,
      thirdTxn: args.thirdTxn,
      sender: args.sender,
      receiver: args.receiver,
      image: args.image,
      title: args.title,
      subtitle: args.subtitle,
      spl: args.spl,
      tags: args.tags,
      amount: args.amount,
    },
    buffer,
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
