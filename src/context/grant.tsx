import { createContext } from '@dwarvesf/react-utils'
import { WithChildren } from 'types/common'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { ProposalFields } from 'idl/accounts'
import { toast } from 'components/Toast'
import { useProgram } from './program'

interface GrantValues {
  proposalBySender: ProposalFields[]
  proposalByRecipient: ProposalFields[]
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
  const [proposalBySender, setProposalBySender] = useState<ProposalFields[]>([])
  const [proposalByRecipient, setProposalByRecipient] = useState<
    ProposalFields[]
  >([])

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
        setProposalBySender(proposalBySender.map((each) => each.account) as any)
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch grant by sender',
          message: error?.message,
        })
      }
    }
    fetchProposalBySender()
  }, [connection, program, publicKey, refreshCount])

  useEffect(() => {
    if (!program || !publicKey) return
    const fetchProposalByRecipient = async () => {
      try {
        const proposalByRecipient = await program.account.proposal.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ])
        setProposalByRecipient(
          proposalByRecipient.map((each) => each.account) as any,
        )
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch grant by recipient',
          message: error?.message,
        })
      }
    }
    fetchProposalByRecipient()
  }, [connection, program, publicKey, refreshCount])

  const refreshGrant = () => {
    setRefreshCount((count) => count + 1)
  }

  return (
    <Provider
      value={{
        proposalBySender,
        proposalByRecipient,
        refreshGrant,
      }}
    >
      {children}
    </Provider>
  )
}

export { GrantProvider, useGrant }