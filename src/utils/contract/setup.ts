import { PublicKey } from '@solana/web3.js'
import { Program, BN } from '@project-serum/anchor'
import { identifierSeed, proposalSeed } from 'constants/contract'

export function findPDAIdentifier(owner: PublicKey, program: Program) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('v1'), Buffer.from(identifierSeed), owner.toBuffer()],
    program.programId,
  )
}

export function findPDAProposal(
  owner: PublicKey,
  identifierCount: BN,
  program: Program,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('v1'),
      Buffer.from(proposalSeed),
      owner.toBuffer(),
      identifierCount.toArrayLike(Buffer, 'le', 8),
    ],
    program.programId,
  )
}
