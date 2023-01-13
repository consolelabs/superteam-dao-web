import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { toast } from 'components/Toast'
import { useGrant } from 'context/grant'
import { useProgram } from 'context/program'
import { GrantDetail } from 'types/grant'
import { findPDAProposal } from 'utils/contract/setup'

const noop = () => {}

export const useGrantActions = (grant: GrantDetail) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { program } = useProgram()
  const { refreshGrant } = useGrant()

  const onSuccess = (
    successCallback: () => void,
    {
      title,
      message,
    }: {
      title: string
      message?: React.ReactNode
    },
  ) => {
    toast.success({ title, message })
    setTimeout(() => {
      refreshGrant()
      successCallback()
    }, 2000)
  }

  const onError = (
    errorCallback: () => void,
    {
      title,
      message,
    }: {
      title: string
      message?: React.ReactNode
    },
  ) => {
    toast.error({ title, message })
    errorCallback()
  }

  const approveGrant = async () => {
    if (!program || !publicKey) return
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
          recipient: publicKey,
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
    if (!program || !publicKey) return
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
          recipient: publicKey,
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

  const handlePoP = async (
    approve: boolean,
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) => {
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

      onSuccess(successCallback, {
        title: approve
          ? 'Prove of Payment approved successfully'
          : 'Prove of Payment rejected successfully',
      })
    } catch (error: any) {
      onError(errorCallback, {
        title: approve
          ? 'Cannot approve Prove of Payment'
          : 'Cannot reject Prove of Payment',
        message: error?.message,
      })
    }
  }
  const approvePoP = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) => handlePoP(true, successCallback, errorCallback)
  const rejectPoP = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) => handlePoP(false, successCallback, errorCallback)

  const sendPoP = async (
    value: string,
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) => {
    if (!program || !publicKey) return
    try {
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .fillTransactionHash(value)
        .accounts({
          proposal: proposalAccount,
          signer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      onSuccess(successCallback, {
        title: 'Submit Proof of payment successfully',
      })
    } catch (error: any) {
      onError(errorCallback, {
        title: 'Cannot submit Proof of payment',
        message: error?.message,
      })
    }
  }

  return {
    approveGrant,
    rejectGrant,
    cancelGrant,
    closeGrant,
    approvePoP,
    rejectPoP,
    sendPoP,
  }
}
