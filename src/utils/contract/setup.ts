import { PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'
import { identifierSeed, proposalSeed } from 'constants/contract'

export function findPDAIdentifier(owner: PublicKey, program: Program) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('v1'), Buffer.from(identifierSeed), owner.toBuffer()],
    program.programId,
  )
}

export function findPDAProposal(
  firstTransaction: string,
  secondTransaction: string,
  thirdTransaction: string,
  sender: PublicKey,
  receiver: PublicKey,
  program: Program,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(proposalSeed),
      Buffer.from(firstTransaction),
      Buffer.from(secondTransaction),
      Buffer.from(thirdTransaction),
      sender.toBuffer(),
      receiver.toBuffer(),
    ],
    program.programId,
  )
}

export const getProposal = async (
  program: Program,
  proposalAccount: PublicKey,
) => {
  try {
    const proposal = await program.account.proposal.fetch(proposalAccount)
    return proposal
  } catch (error) {
    return null
  }
}
