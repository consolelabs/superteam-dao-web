import { Program } from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
import { toast, ToastProps } from 'components/Toast'
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
    toastOptions?: ToastProps,
  ) => {
    if (toastOptions) {
      toast.success(toastOptions)
    }
    setTimeout(() => {
      refreshGrant()
      successCallback()
    }, 2000)
  }

  const onError = (errorCallback: () => void, toastOptions?: ToastProps) => {
    if (toastOptions) {
      toast.error(toastOptions)
    }
    errorCallback()
  }

  const handleGrant = async (
    method?: Program['methods'][string],
    options?: {
      successCallback?: () => void
      errorCallback?: () => void
      successToastOptions?: ToastProps
      errorToastOptions?: ToastProps
    },
  ) => {
    if (!program || !publicKey || !method) return
    const {
      successCallback = noop,
      errorCallback = noop,
      successToastOptions,
      errorToastOptions,
    } = options || {}
    try {
      const [proposalAccount] = findPDAProposal(
        grant.transaction.substring(0, 32),
        grant.transaction.substring(32, 64),
        grant.transaction.substring(64, 88),
        grant.sender,
        grant.receiver,
        program,
      )
      const transaction = await method()
        .accounts({
          proposal: proposalAccount,
          sender: publicKey,
          receiver: publicKey,
          payer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      onSuccess(successCallback, successToastOptions)
    } catch (error: any) {
      onError(
        errorCallback,
        errorToastOptions
          ? { message: error?.message, ...errorToastOptions }
          : undefined,
      )
    }
  }

  const approveGrant = (
    type: 'sender' | 'receiver',
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(
      type === 'sender'
        ? program?.methods.senderApproveProposal
        : program?.methods.receiverApproveProposal,
      {
        successCallback,
        errorCallback,
        successToastOptions: { title: 'Grant approved successfully' },
        errorToastOptions: { title: 'Cannot approve grant' },
      },
    )

  const rejectGrant = (
    type: 'sender' | 'receiver',
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(
      type === 'sender'
        ? program?.methods.senderRejectProposal
        : program?.methods.receiverRejectProposal,
      {
        successCallback,
        errorCallback,
        successToastOptions: { title: 'Grant rejected successfully' },
        errorToastOptions: { title: 'Cannot reject grant' },
      },
    )

  const cancelGrant = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.cancelProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Grant canceled successfully' },
      errorToastOptions: { title: 'Cannot cancel grant' },
    })

  const closeGrant = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.closeProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Grant closed successfully' },
      errorToastOptions: { title: 'Cannot close grant' },
    })

  return {
    approveGrant,
    rejectGrant,
    cancelGrant,
    closeGrant,
  }
}
