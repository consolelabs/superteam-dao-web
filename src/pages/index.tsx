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
import { GrantProvider, useGrant } from 'context/grant'
import { grantStatusMapping, GRANT_STATUS } from 'constants/grant'
import { GrantDetail } from 'types/grant'

const filterData = (
  data: GrantDetail[],
  filters: { tags: string[]; approver: string },
) => {
  const { tags, approver } = filters
  return data
    .filter((each) =>
      !tags.length
        ? true
        : tags.every((tag) => each.tags.split(',').includes(tag)),
    )
    .filter((each) =>
      !approver
        ? true
        : String(each.owner ? each.recipient : each.sender) === approver,
    )
}

const HomePage = () => {
  const { user } = useAuthContext()
  const { publicKey } = useWallet()
  const { proposalBySender, proposalByRecipient } = useGrant()
  const [activeTab, setActiveTab] = useState('pending')
  const [filter, setFilter] = useState<'sender' | 'recipient'>('sender')
  const [tags, setTags] = useState<string[]>([])
  const [approver, setApprover] = useState('')

  const grantData = filterData(
    filter === 'sender' ? proposalBySender : proposalByRecipient,
    { tags, approver },
  )
  const tabData = [
    {
      id: 'pending',
      label: 'Pending',
      content: (
        <GrantList
          filter={filter}
          data={grantData.filter(
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
          data={grantData.filter(
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
          data={grantData.filter(
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
          {formatWallet(String(publicKey)) || 'Loading...'}
        </Text>
        <div className="mt-5">
          <Text as="b" className="font-bold mb-3 block">
            Your proof of works
          </Text>
          <ul className="list-none flex space-x-3">
            <li>
              <img
                src="https://cdn.galxe.com/galaxy/delysium/7930bb02-c86f-410d-95e9-a7aad36c46ce.png?optimizer=image&width=800&quality=100"
                alt="Proof of work NFT"
                className="w-12 h-12 object-cover border border-slate-100 rounded-full"
              />
            </li>
            <li>
              <img
                src="https://cdn.galxe.com/galaxy/delysium/7930bb02-c86f-410d-95e9-a7aad36c46ce.png?optimizer=image&width=800&quality=100"
                alt="Proof of work NFT"
                className="w-12 h-12 object-cover border border-slate-100 rounded-full"
              />
            </li>
          </ul>
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
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
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
