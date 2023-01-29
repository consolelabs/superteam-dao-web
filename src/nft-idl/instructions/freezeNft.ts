import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface FreezeNftAccounts {
  payer: PublicKey
  authority: PublicKey
  nftMint: PublicKey
  nftMetadata: PublicKey
  ata: PublicKey
  edition: PublicKey
  metadataProgram: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  rent: PublicKey
}

export function freezeNft(accounts: FreezeNftAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: true },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
    { pubkey: accounts.nftMetadata, isSigner: false, isWritable: false },
    { pubkey: accounts.ata, isSigner: false, isWritable: true },
    { pubkey: accounts.edition, isSigner: false, isWritable: false },
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([138, 89, 228, 134, 233, 179, 225, 209])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
