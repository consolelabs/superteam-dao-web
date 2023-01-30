import { createContext } from '@dwarvesf/react-utils'
import { WithChildren } from 'types/common'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { toast } from 'components/Toast'
import { GrantDetail } from 'types/grant'
import { Metadata, Metaplex } from '@metaplex-foundation/js'
import fetcher from 'libs/fetcher'
import { useProgram } from './program'

interface UriData {
  name?: string
  description?: string
  image?: string
  account?: string
}

export interface NftData {
  nft: Metadata
  uriData?: UriData
}

interface GrantValues {
  sentGrant: GrantDetail[]
  receivedGrant: GrantDetail[]
  submittedGrant: GrantDetail[]
  nfts: NftData[]
  nftLoading: boolean
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
  const [nfts, setNfts] = useState<NftData[]>([])
  const [nftLoading, setNftLoading] = useState(false)

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

  useEffect(() => {
    if (!publicKey) return
    const findAllNfts = async () => {
      try {
        setNftLoading(true)
        const metaplex = new Metaplex(connection)
        const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey })
        const data = await Promise.allSettled(
          nfts.map((each) => fetcher<UriData>(each.uri)),
        )
        const result: NftData[] = data.flatMap((each, index) =>
          each.status === 'fulfilled' && each.value.account
            ? [{ nft: nfts[index] as Metadata, uriData: each.value }]
            : [],
        )
        setNfts(result)
        setNftLoading(false)
      } catch (error) {
        setNfts([])
        setNftLoading(false)
      }
    }
    findAllNfts()
  }, [connection, publicKey])

  return (
    <Provider
      value={{
        sentGrant,
        receivedGrant,
        submittedGrant,
        nfts,
        nftLoading,
        refreshGrant,
      }}
    >
      {children}
    </Provider>
  )
}

export { GrantProvider, useGrant }
