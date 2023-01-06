import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useAuthContext } from 'context/auth'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { GrantItemType } from 'types/GrantItem'
import { GrantList } from 'components/GrantList'
import { Input } from 'components/Input'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'
import { IconChevronUp } from 'components/icons/components/IconChevronUp'
import { useProgram } from 'context/program'

const grantItems: GrantItemType[] = [
  {
    name: 'Grant 1',
    receiverWallet: 'Bu61gzC1axsgn7hRSpK8aXdP1FkUkQBSU9pmvbDEReGq',
    tokenAmount: 1000,
    tokenSymbol: 'SOL',
    tokenAddress: 'So11111111111111111111111111111111111111112',
    status: 'pending',
    avatar:
      'https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png',
    tags: ['nft, gamefi'],
  },
  {
    name: 'Grant 2',
    receiverWallet: 'Bu61gzC1axsgn7hRSpK8aXdP1FkUkQBSU9pmvbDEReGq',
    tokenAmount: 1000,
    tokenSymbol: 'SOL',
    tokenAddress: 'So11111111111111111111111111111111111111112',
    status: 'pending',
    avatar:
      'https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png',
    tags: ['nft, gamefi'],
  },
  {
    name: 'Grant 3',
    receiverWallet: 'Bu61gzC1axsgn7hRSpK8aXdP1FkUkQBSU9pmvbDEReGq',
    tokenAmount: 1000,
    tokenSymbol: 'SOL',
    tokenAddress: 'So11111111111111111111111111111111111111112',
    status: 'pending',
    avatar:
      'https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png',
    tags: ['nft, gamefi', 'nft, gamefi', 'nft, gamefi'],
  },
  {
    name: 'Grant 4',
    receiverWallet: 'Bu61gzC1axsgn7hRSpK8aXdP1FkUkQBSU9pmvbDEReGq',
    tokenAmount: 1000,
    tokenSymbol: 'SOL',
    tokenAddress: 'So11111111111111111111111111111111111111112',
    status: 'approved',
    avatar:
      'https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png',
    tags: ['nft', 'gamefi'],
  },
  {
    name: 'Grant 5',
    receiverWallet: 'Bu61gzC1axsgn7hRSpK8aXdP1FkUkQBSU9pmvbDEReGq',
    tokenAmount: 1000,
    tokenSymbol: 'SOL',
    tokenAddress: 'So11111111111111111111111111111111111111112',
    status: 'rejected',
    avatar:
      'https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png',
    tags: [
      'nft',
      'gamefi',
      'nft',
      'gamefi',
      'nft',
      'gamefi',
      'nft',
      'gamefi',
      'nft',
      'gamefi',
      'nft',
      'gamefi',
    ],
  },
]

const HomePage = () => {
  const { user } = useAuthContext()
  const { program } = useProgram()
  const [activeTab, setActiveTab] = useState('approved')

  const handleChangeTab = (tabId: string) => {
    setActiveTab(tabId)
  }

  const filteredItems = grantItems.filter((i) => i.status === activeTab)

  const tabData = [
    {
      id: 'pending',
      label: 'Pending',
      content: <GrantList data={filteredItems} />,
    },
    {
      id: 'approved',
      label: 'Approved',
      content: <GrantList data={filteredItems} />,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      content: <GrantList data={filteredItems} />,
    },
  ]

  useEffect(() => {
    if (!program) return
    const fetch = async () => {
      try {
        const proposal = await program.account.proposal.all()
        console.log({ proposal })
      } catch (error) {
        console.log({ error })
      }
    }
    fetch()
  }, [program])

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
        <Text className="block text-center text-slate-400">
          {user.firstName}
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
        <div className="flex justify-between mb-5">
          <div>
            <Button appearance="primary" size="lg" className="mr-4" active>
              Sent Grant
            </Button>
            <Button appearance="primary" size="lg">
              Received Grant
            </Button>
          </div>
          <div>
            <Input
              type="search"
              placeholder="Search approver address"
              className="w-[18rem] mr-4"
            />
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                data-testid="profile-button"
                as={Button}
                appearance="border"
              >
                {({ open }) => (
                  <>
                    Tags
                    <span className="w-4 h-4 ml-2 text-purple-600">
                      {open ? <IconChevronUp /> : <IconChevronDown />}
                    </span>
                  </>
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-48 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-pink-600 text-white' : 'text-gray-500'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm space-x-2`}
                      >
                        <span>Logout</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
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
