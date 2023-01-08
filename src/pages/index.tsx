import React, { useState } from 'react'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useAuthContext } from 'context/auth'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { GrantList } from 'components/GrantList'
import { Input } from 'components/Input'
import { useWallet } from '@solana/wallet-adapter-react'
import { CustomListbox } from 'components/Listbox'
import { formatWallet } from 'utils/formatWallet'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantProvider, useGrant } from 'context/grant'

const HomePage = () => {
  const { user } = useAuthContext()
  const { publicKey } = useWallet()
  const { proposalBySender, proposalByRecipient } = useGrant()

  const [activeTab, setActiveTab] = useState('pending')
  const [filter, setFilter] = useState<'sender' | 'recipient'>('sender')
  const [tags, setTags] = useState<string[]>([])

  const tabData =
    filter === 'sender'
      ? [
          {
            id: 'pending',
            label: 'Pending',
            content: (
              <GrantList
                filter={filter}
                data={proposalBySender.filter((grant) =>
                  [GRANT_STATUS.PENDING, GRANT_STATUS.REJECTED].includes(
                    grantStatusMapping[grant.status],
                  ),
                )}
              />
            ),
          },
          {
            id: 'approved',
            label: 'Approved',
            content: (
              <GrantList
                filter={filter}
                data={proposalBySender.filter(
                  (grant) =>
                    grantStatusMapping[grant.status] === GRANT_STATUS.APPROVED,
                )}
              />
            ),
          },
        ]
      : [
          {
            id: 'pending',
            label: 'Pending',
            content: (
              <GrantList
                filter={filter}
                data={proposalByRecipient.filter(
                  (grant) =>
                    grantStatusMapping[grant.status] === GRANT_STATUS.PENDING,
                )}
              />
            ),
          },
          {
            id: 'approved',
            label: 'Approved',
            content: (
              <GrantList
                filter={filter}
                data={proposalByRecipient.filter(
                  (grant) =>
                    grantStatusMapping[grant.status] === GRANT_STATUS.APPROVED,
                )}
              />
            ),
          },
          {
            id: 'rejected',
            label: 'Rejected',
            content: (
              <GrantList
                filter={filter}
                data={proposalByRecipient.filter(
                  (grant) =>
                    grantStatusMapping[grant.status] === GRANT_STATUS.REJECTED,
                )}
              />
            ),
          },
        ]

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
              onClick={() => {
                setActiveTab('pending')
                setFilter('sender')
              }}
            >
              Sent Grant
            </Button>
            <Button
              appearance={filter === 'recipient' ? 'primary' : 'border'}
              size="lg"
              onClick={() => {
                setActiveTab('pending')
                setFilter('recipient')
              }}
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
          <Tabs activeTab={activeTab} onChange={setActiveTab} data={tabData} />
        </div>
      </div>
    </Layout>
  )
}

export default () => (
  <GrantProvider>
    <HomePage />
  </GrantProvider>
)
