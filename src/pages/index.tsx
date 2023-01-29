import React, { useState } from 'react'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useAuthContext } from 'context/auth'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { Input } from 'components/Input'
import { useWallet } from '@solana/wallet-adapter-react'
import { CustomListbox } from 'components/Listbox'
import { formatWallet } from 'utils/formatWallet'
import { GrantProvider, useGrant } from 'context/grant'
import { GRANT_STATUS } from 'constants/grant'
import { GrantList } from 'components/GrantList'
import { getGrantStatus } from 'utils/grant'

const HomePage = () => {
  const { user } = useAuthContext()
  const { publicKey } = useWallet()
  const { sentGrant, receivedGrant, submittedGrant } = useGrant()
  const [activeTab, setActiveTab] = useState('pending')
  const [filter, setFilter] = useState<'submitted' | 'other'>('submitted')
  const [tags, setTags] = useState<string[]>([])
  const [approver, setApprover] = useState('')

  const grants = {
    submitted: submittedGrant,
    other: [...sentGrant, ...receivedGrant],
  }[filter]
  const pendingGrants = grants.filter(
    (grant) => getGrantStatus(grant) === GRANT_STATUS.PENDING,
  )
  const approvedGrants = grants.filter(
    (grant) => getGrantStatus(grant) === GRANT_STATUS.APPROVED,
  )
  const rejectedGrants = grants.filter(
    (grant) => getGrantStatus(grant) === GRANT_STATUS.REJECTED,
  )
  const tabData = [
    {
      id: 'pending',
      label: `Pending (${pendingGrants.length})`,
      content: <GrantList filter={filter} data={pendingGrants} />,
    },
    {
      id: 'approved',
      label: `Approved (${approvedGrants.length})`,
      content: <GrantList filter={filter} data={approvedGrants} />,
    },
    {
      id: 'rejected',
      label: `Rejected (${rejectedGrants.length})`,
      content: <GrantList filter={filter} data={rejectedGrants} />,
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
        {publicKey && (
          <Text as="b" className="block mb-2 text-xl text-center">
            {formatWallet(String(publicKey)) || 'Loading...'}
          </Text>
        )}
        <div className="mt-5">
          <Text as="b" className="block mb-3 font-bold">
            Your proof of works
          </Text>
          <ul className="flex space-x-3 list-none">
            <li>
              <img
                src="https://cdn.galxe.com/galaxy/delysium/7930bb02-c86f-410d-95e9-a7aad36c46ce.png?optimizer=image&width=800&quality=100"
                alt="Proof of work NFT"
                className="object-cover w-12 h-12 border rounded-full border-slate-100"
              />
            </li>
            <li>
              <img
                src="https://cdn.galxe.com/galaxy/delysium/7930bb02-c86f-410d-95e9-a7aad36c46ce.png?optimizer=image&width=800&quality=100"
                alt="Proof of work NFT"
                className="object-cover w-12 h-12 border rounded-full border-slate-100"
              />
            </li>
          </ul>
        </div>
      </aside>
      <div className="flex flex-col flex-grow px-4">
        <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-between">
          <div className="flex mb-5 mr-4">
            <Button
              appearance={filter === 'submitted' ? 'primary' : 'border'}
              className="h-10 mr-4"
              onClick={() => {
                setActiveTab('pending')
                setFilter('submitted')
              }}
            >
              Submitted Grant
            </Button>
            <Button
              appearance={filter === 'other' ? 'primary' : 'border'}
              className="h-10 mr-4"
              onClick={() => {
                setActiveTab('pending')
                setFilter('other')
              }}
            >
              Received Grant
            </Button>
          </div>
          <div className="flex mb-5">
            <Input
              type="search"
              placeholder="Search address / title"
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
