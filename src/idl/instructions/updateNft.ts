import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface UpdateNftArgs {
  nft: PublicKey
}

export interface UpdateNftAccounts {
  proposal: PublicKey
  receiver: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.publicKey('nft')])

export function updateNft(args: UpdateNftArgs, accounts: UpdateNftAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.proposal, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([97, 5, 62, 85, 23, 92, 96, 25])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      nft: args.nft,
    },
    buffer,
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
