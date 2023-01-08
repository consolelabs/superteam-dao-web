import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { Button } from 'components/Button'
import { toast } from 'components/Toast'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { useGrant } from 'context/grant'
import { useProgram } from 'context/program'
import { ProposalFields } from 'idl/accounts'
import { findPDAProposal } from 'utils/contract/setup'

interface RecipientActionProps {
  grant: ProposalFields
}

export const RecipientAction = ({ grant }: RecipientActionProps) => {
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { program } = useProgram()
  const { refreshGrant } = useGrant()

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

      toast.success({
        title: 'Grant approved successfully',
      })
      setTimeout(() => {
        refreshGrant()
      }, 2000)
    } catch (error: any) {
      toast.error({
        title: 'Cannot approve grant',
        message: error?.message,
      })
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

      toast.success({
        title: 'Grant rejected successfully',
      })
      setTimeout(() => {
        refreshGrant()
      }, 2000)
    } catch (error: any) {
      toast.error({
        title: 'Cannot reject grant',
        message: error?.message,
      })
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
