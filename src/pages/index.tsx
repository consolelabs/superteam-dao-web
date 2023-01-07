import React, { useEffect, useState } from 'react'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useAuthContext } from 'context/auth'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { GrantList } from 'components/GrantList'
import { Input } from 'components/Input'
import { useProgram } from 'context/program'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ProposalFields } from 'idl/accounts'
import { CustomListbox } from 'components/Listbox'
import { formatWallet } from 'utils/formatWallet'

const HomePage = () => {
  const { user } = useAuthContext()
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { program } = useProgram()
  const [proposalBySender, setProposalBySender] = useState<ProposalFields[]>([])
  const [proposalByRecipient, setProposalByRecipient] = useState<
    ProposalFields[]
  >([])
  const [activeTab, setActiveTab] = useState('pending')
  const [filter, setFilter] = useState<'sender' | 'recipient'>('sender')
  const [tags, setTags] = useState<string[]>([])

  const handleChangeTab = (tabId: string) => {
    setActiveTab(tabId)
  }

  const grantList = filter === 'sender' ? proposalBySender : proposalByRecipient
  const tabData = [
    {
      id: 'pending',
      label: 'Pending',
      content: (
        <GrantList data={grantList.filter((grant) => grant.status === 0)} />
      ),
    },
    {
      id: 'approved',
      label: 'Approved',
      content: (
        <GrantList data={grantList.filter((grant) => grant.status === 2)} />
      ),
    },
    {
      id: 'rejected',
      label: 'Rejected',
      content: (
        <GrantList data={grantList.filter((grant) => grant.status === 3)} />
      ),
    },
  ]

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
      } catch (error) {
        console.log({ error })
      }
    }
    fetchProposalBySender()
  }, [connection, program, publicKey])

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
      } catch (error) {
        console.log({ error })
      }
    }
    fetchProposalByRecipient()
  }, [connection, program, publicKey])

  return (
    <Layout>
      <aside className="w-[16rem] flex-none px-9 mr-4 border-2 border-purple-600 rounded-lg py-8 flex min-h-full flex-col">
        <div className="mb-4 text-center">
          <span className="overflow-hidden rounded-full w-[86px] h-[86px] inline-flex mx-auto">
            <img
              src={user.avatar}
              alt="avatar sidebar"
              width="86"
              height="86"
              className="rounded-full"
            />
          </span>
        </div>
        <Text as="b" className="block mb-2 text-xl text-center">
          {user.firstName}
        </Text>
        <Text className="block text-sm text-center text-slate-400">
          {formatWallet(String(publicKey))}
        </Text>
        <div className="mt-5">
          <Text className="text-lg">Proof of work</Text>
          <Text className="text-slate-300">10000 USD earned</Text>
          <Text className="text-slate-300">10000 SOL earned</Text>
          <Text className="mt-5 text-lg">Transaction</Text>
          <Button
            as="a"
            target="_blank"
            appearance="link"
            href="https://solscan.io/tx/49ZGRVb8E76Q9UVjYLUHffG5EXaKuvJ89HKtDsqa73CZyWJBP2tRJnCD74BGC235CW5cTQN4koMUFyPnLGgiLXH4"
            className="block max-w-full mb-1 truncate"
            size="lg"
            display="block"
          >
            49ZGRVb8E76Q9UVjYLUHffG5EXaKuvJ89HKtDsqa73CZyWJBP2tRJnCD74BGC235CW5cTQN4koMUFyPnLGgiLXH4
          </Button>
          <Button
            as="a"
            target="_blank"
            appearance="link"
            href="https://solscan.io/tx/49ZGRVb8E76Q9UVjYLUHffG5EXaKuvJ89HKtDsqa73CZyWJBP2tRJnCD74BGC235CW5cTQN4koMUFyPnLGgiLXH4"
            className="block max-w-full mb-1 truncate"
            size="lg"
            display="block"
          >
            49ZGRVb8E76Q9UVjYLUHffG5EXaKuvJ89HKtDsqa73CZyWJBP2tRJnCD74BGC235CW5cTQN4koMUFyPnLGgiLXH4
          </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-grow px-4">
        <div className="flex flex-col flex-wrap items-center mb-5 space-y-3 md:flex-row md:justify-between">
          <div>
            <Button
              appearance={filter === 'sender' ? 'primary' : 'border'}
              size="lg"
              className="mr-4"
              onClick={() => setFilter('sender')}
            >
              Sent Grant
            </Button>
            <Button
              appearance={filter === 'recipient' ? 'primary' : 'border'}
              size="lg"
              onClick={() => setFilter('recipient')}
            >
              Received Grant
            </Button>
          </div>
          <div className="flex">
            <Input
              type="search"
              placeholder="Search approver address"
              className="w-[18rem] mr-4"
            />
            <CustomListbox
              value={tags}
              onChange={(value) => setTags(Array.from(value))}
              placeholder="Tags"
              multiple
              items={[
                { key: 'GameFi', value: 'GameFi' },
                { key: 'DeFi', value: 'DeFi' },
                { key: 'Payment', value: 'Payment' },
                { key: 'SocialFi', value: 'SocialFi' },
              ]}
              className="w-40"
            />
          </div>
        </div>
        <div className="flex-grow px-12 py-8 border-2 border-purple-600 rounded-lg">
          <Tabs
            activeTab={activeTab}
            onChange={handleChangeTab}
            data={tabData}
          />
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
