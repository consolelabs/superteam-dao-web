import { createContext } from '@dwarvesf/react-utils'
import { WithChildren } from 'types/common'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { toast } from 'components/Toast'
import { GrantDetail } from 'types/grant'
import { useProgram } from './program'

interface GrantValues {
  sentGrant: GrantDetail[]
  receivedGrant: GrantDetail[]
  submittedGrant: GrantDetail[]
  refreshGrant: () => void
}

const [Provider, useGrant] = createContext<GrantValues>({
  name: 'grant',
})

const GrantProvider = ({ children }: WithChildren) => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { program } = useProgram()

  const [refreshCount, setRefreshCount] = useState(0)
  const [sentGrant, setSentGrant] = useState<GrantDetail[]>([])
  const [receivedGrant, setReceivedGrant] = useState<GrantDetail[]>([])
  const [submittedGrant, setSubmittedGrant] = useState<GrantDetail[]>([])

  useEffect(() => {
    if (!program || !publicKey) return
    const fetchProposalBySender = async () => {
      try {
        const proposalBySender = await program.account.proposal.all([
          {
            memcmp: {
              offset: 40,
              bytes: publicKey.toBase58(),
            },
          },
        ])
        setSentGrant(
          proposalBySender.map((each) => ({
            ...each.account,
            account: each.publicKey,
          })) as any,
        )
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch sent grant',
          message: error?.message,
        })
      }
    }
    fetchProposalBySender()
  }, [connection, program, publicKey, refreshCount])

  useEffect(() => {
    if (!program || !publicKey) return
    const fetchProposalByReceiver = async () => {
      try {
        const proposalByReceiver = await program.account.proposal.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ])
        setReceivedGrant(
          proposalByReceiver.map((each) => ({
            ...each.account,
            account: each.publicKey,
          })) as any,
        )
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch received grant',
          message: error?.message,
        })
      }
    }
    fetchProposalByReceiver()
  }, [connection, program, publicKey, refreshCount])

  useEffect(() => {
    if (!program || !publicKey) return
    const fetchProposalBySubmitter = async () => {
      try {
        const proposalBySubmitter = await program.account.proposal.all([
          {
            memcmp: {
              offset: 72,
              bytes: publicKey.toBase58(),
            },
          },
        ])
        setSubmittedGrant(
          proposalBySubmitter.map((each) => ({
            ...each.account,
            account: each.publicKey,
          })) as any,
        )
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch submitted grant',
          message: error?.message,
        })
      }
    }
    fetchProposalBySubmitter()
  }, [connection, program, publicKey, refreshCount])

  const refreshGrant = () => {
    setRefreshCount((count) => count + 1)
  }

  return (
    <Provider
      value={{
        sentGrant,
        receivedGrant,
        submittedGrant,
        refreshGrant,
      }}
    >
      {children}
    </Provider>
  )
}

export { GrantProvider, useGrant }
