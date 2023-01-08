import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { Button } from 'components/Button'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { useProgram } from 'context/program'
import { ProposalFields } from 'idl/accounts'
import { findPDAProposal } from 'utils/contract/setup'
import { retry } from 'utils/retry'

interface SenderActionProps {
  grant: ProposalFields
}

export const SenderAction = ({ grant }: SenderActionProps) => {
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { program } = useProgram()

  const cancelGrant = async () => {
    if (!program) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .cancelProposal()
        .accounts({
          proposal: proposalAccount,
          sender: grant.sender,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const proposalCancelData = await retry(
        () => program.account.proposal.fetch(proposalAccount),
        2000,
        3,
      )
      console.log(
        '[proposal cancel account] Create result: ',
        proposalCancelData,
      )
    } catch (error) {
      console.log({ error })
    }
  }

  const closeGrant = async () => {}

  return {
    [GRANT_STATUS.PENDING]: (
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={cancelGrant}
      >
        Cancel
      </Button>
    ),
    [GRANT_STATUS.REJECTED]: (
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={closeGrant}
      >
        Close
      </Button>
    ),
    [GRANT_STATUS.APPROVED]: (
      <Button appearance="link" size="md" className="text-purple-600">
        Mint Proof of Work
      </Button>
    ),
  }[grantStatusMapping[grant.status]]
}
