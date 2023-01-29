import { PublicKey, SystemProgram } from '@solana/web3.js'
import {
  PROGRAM_ID,
  PROGRAM_ID as MPL_TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Program } from '@project-serum/anchor'
import { PROGRAM_FREEZE_NFT_ID } from 'nft-idl/programId'

export const findAuthorityAddress = (payer: PublicKey, nft_mint: PublicKey) => {
  const [address] = PublicKey.findProgramAddressSync(
    [Buffer.from('freeze'), payer.toBuffer(), nft_mint.toBuffer()],
    PROGRAM_FREEZE_NFT_ID,
  )
  return address
}

export const FreezeNft = async (
  payer: PublicKey,
  nft_mint: PublicKey,
  program: Program,
) => {
  const authority = findAuthorityAddress(payer, nft_mint)
  const nftMetadata = getMetadataPDA(nft_mint)
  const edition = getMasterEditionPDA(nft_mint)
  const ata = await getAssociatedTokenAddress(nft_mint, payer)

  const transaction = await program.methods
    .freezeNft()
    .accounts({
      payer,
      authority,
      nftMint: nft_mint,
      nftMetadata,
      ata,
      edition,
      metadataProgram: PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction()

  return transaction
}

export function getMetadataPDA(mint: PublicKey) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    MPL_TOKEN_METADATA_PROGRAM_ID,
  )
  return publicKey
}

export function getMasterEditionPDA(mint: PublicKey) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    MPL_TOKEN_METADATA_PROGRAM_ID,
  )
  return publicKey
}
