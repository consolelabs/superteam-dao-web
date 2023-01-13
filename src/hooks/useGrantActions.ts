import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { toast } from 'components/Toast'
import { useGrant } from 'context/grant'
import { useProgram } from 'context/program'
import { GrantDetail } from 'types/grant'
import { findPDAProposal } from 'utils/contract/setup'

export const useGrantActions = (grant: GrantDetail) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
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
        .approveProposal()
        .accounts({
          proposal: proposalAccount,
          recipient: grant.recipient,
          systemProgram: SystemProgram.programId,
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

  const cancelGrant = async () => {
    if (!program || !publicKey) return
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
          sender: publicKey,
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
    if (!program || !publicKey) return
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
          sender: publicKey,
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

  const handlePoP = async (approve: boolean) => {
    if (!program || !publicKey) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const method = approve
        ? program.methods.applicantConfirmProposal
        : program.methods.applicantRejectProposal
      const transaction = await method()
        .accounts({
          proposal: proposalAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      toast.success({
        title: approve
          ? 'Prove of Payment approved successfully'
          : 'Prove of Payment rejected successfully',
      })
      setTimeout(() => {
        refreshGrant()
      }, 2000)
    } catch (error: any) {
      toast.error({
        title: approve
          ? 'Cannot approve Prove of Payment'
          : 'Cannot reject Prove of Payment',
        message: error?.message,
      })
    }
  }
  const approvePoP = () => handlePoP(true)
  const rejectPoP = () => handlePoP(false)

  return {
    approveGrant,
    rejectGrant,
    cancelGrant,
    closeGrant,
    approvePoP,
    rejectPoP,
  }
}
