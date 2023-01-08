import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { Button } from 'components/Button'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { useProgram } from 'context/program'
import { ProposalFields } from 'idl/accounts'
import { findPDAProposal } from 'utils/contract/setup'
import { retry } from 'utils/retry'

interface RecipientActionProps {
  grant: ProposalFields
}

export const RecipientAction = ({ grant }: RecipientActionProps) => {
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { program } = useProgram()

  const approveGrant = async () => {
    if (!program) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .approveProposal('')
        .accounts({
          proposal: proposalAccount,
          recipient: grant.recipient,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const proposalApproveData = await retry(
        () => program.account.proposal.fetch(proposalAccount),
        2000,
        3,
      )
      console.log(
        '[proposal approve account] Create result: ',
        proposalApproveData,
      )
    } catch (error) {
      console.log({ error })
    }
  }

  const rejectGrant = async () => {
    if (!program) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .rejectProposal()
        .accounts({
          proposal: proposalAccount,
          recipient: grant.recipient,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const proposalRejectData = await retry(
        () => program.account.proposal.fetch(proposalAccount),
        2000,
        3,
      )
      console.log(
        '[proposal reject account] Create result: ',
        proposalRejectData,
      )
    } catch (error) {
      console.log({ error })
    }
  }

  return {
    [GRANT_STATUS.PENDING]: (
      <>
        <Button
          appearance="link"
          size="md"
          className="text-purple-600"
          onClick={approveGrant}
        >
          Approve
        </Button>
        {' / '}
        <Button
          appearance="link"
          size="md"
          className="text-purple-600"
          onClick={rejectGrant}
        >
          Reject
        </Button>
      </>
    ),
    [GRANT_STATUS.REJECTED]: (
      <Button appearance="link" size="md" className="text-purple-600">
        View Grant
      </Button>
    ),
    [GRANT_STATUS.APPROVED]: (
      <Button appearance="link" size="md" className="text-purple-600">
        View Grant
      </Button>
    ),
  }[grantStatusMapping[grant.status]]
}
