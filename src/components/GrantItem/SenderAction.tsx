import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { Button } from 'components/Button'
import { toast } from 'components/Toast'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { useGrant } from 'context/grant'
import { useProgram } from 'context/program'
import { ProposalFields } from 'idl/accounts'
import { findPDAProposal } from 'utils/contract/setup'

interface SenderActionProps {
  grant: ProposalFields
}

export const SenderAction = ({ grant }: SenderActionProps) => {
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { program } = useProgram()
  const { refreshGrant } = useGrant()

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

      toast.success({
        title: 'Grant canceled successfully',
      })
      setTimeout(() => {
        refreshGrant()
      }, 2000)
    } catch (error: any) {
      toast.error({
        title: 'Cannot cancel grant',
        message: error?.message,
      })
    }
  }

  const closeGrant = async () => {
    if (!program) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .closeProposal()
        .accounts({
          proposal: proposalAccount,
          sender: grant.sender,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      toast.success({
        title: 'Grant closed successfully',
      })
      setTimeout(() => {
        refreshGrant()
      }, 2000)
    } catch (error: any) {
      toast.error({
        title: 'Cannot close grant',
        message: error?.message,
      })
    }
  }

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
