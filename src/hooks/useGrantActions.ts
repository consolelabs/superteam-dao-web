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
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await method()
        .accounts({
          proposal: proposalAccount,
          sender: publicKey,
          recipient: publicKey,
          signer: publicKey,
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
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.approveProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Grant approved successfully' },
      errorToastOptions: { title: 'Cannot approve grant' },
    })

  const rejectGrant = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.rejectProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Grant rejected successfully' },
      errorToastOptions: { title: 'Cannot reject grant' },
    })

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

  const approvePoP = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.applicantConfirmProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Proof of Payment approved successfully' },
      errorToastOptions: { title: 'Cannot approve Proof of Payment' },
    })

  const rejectPoP = (
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(program?.methods.applicantRejectProposal, {
      successCallback,
      errorCallback,
      successToastOptions: { title: 'Proof of Payment rejected successfully' },
      errorToastOptions: { title: 'Cannot reject Proof of Payment' },
    })

  const sendPoP = (
    value: string,
    successCallback: () => void = noop,
    errorCallback: () => void = noop,
  ) =>
    handleGrant(
      program ? () => program.methods.fillTransactionHash(value) : undefined,
      {
        successCallback,
        errorCallback,
        successToastOptions: {
          title: 'Proof of Payment submitted successfully',
        },
        errorToastOptions: { title: 'Cannot submit Proof of Payment' },
      },
    )

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
