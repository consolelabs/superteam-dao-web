import { useDisclosure } from '@dwarvesf/react-hooks'
import { Menu, Transition } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { Divider } from 'components/Divider'
import { IconLogout } from 'components/icons/components/IconLogout'
import { IconPencilAlt } from 'components/icons/components/IconPencilAlt'
import { IconWallet } from 'components/icons/components/IconWallet'
import { Text } from 'components/Text'
import { useAuthContext } from 'context/auth'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { formatWallet } from 'utils/formatWallet'
import { ProfileModal } from './ProfileModal'
import { WalletModal } from './WalletModal'
// import { Logo } from './Logo'

export const Header = () => {
  const { logout, user } = useAuthContext()
  const { publicKey, connected } = useWallet()
  const {
    isOpen: isOpenProfileModal,
    onClose: onCloseProfileModal,
    onOpen: onOpenProfileModal,
  } = useDisclosure()
  const {
    isOpen: isOpenWalletModal,
    onClose: onCloseWalletModal,
    onOpen: onOpenWalletModal,
  } = useDisclosure()

  return (
    <header className="z-50 px-5 py-2 border-b border-b-gray-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <span className="inline-flex">
            {/* <span className="inline-block w-8 h-8 mr-2">
              <Logo />
            </span> */}
            <Text id="logo" as="strong">
              Solana Grant
            </Text>
          </span>
          <div className="flex items-center space-x-3">
            <Link href="/grant/new">
              <Button appearance="border">Create new grant</Button>
            </Link>
            {connected ? (
              <Menu as="div" className="relative inline-block text-left z-100">
                <Menu.Button
                  className="flex items-center h-full space-x-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  data-testid="profile-button"
                >
                  <img
                    src={user.avatar}
                    alt=""
                    width="36"
                    height="36"
                    className="rounded-full"
                  />
                  <span className="text-sm">
                    {formatWallet(String(publicKey))}
                  </span>
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
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-500'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm space-x-2`}
                            onClick={onOpenWalletModal}
                          >
                            <IconWallet className="w-5 h-5" />
                            <span>Wallet info</span>
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-500'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm space-x-2`}
                            onClick={onOpenProfileModal}
                          >
                            <IconPencilAlt className="w-5 h-5" />
                            <span>Edit profile</span>
                          </button>
                        )}
                      </Menu.Item>
                      <Divider className="h-0 mx-2 mb-px" />
                      <div />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-500'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm space-x-2`}
                            onClick={logout}
                            data-testid="logout-button"
                          >
                            <IconLogout className="w-5 h-5" />
                            <span>Logout</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Button appearance="primary" onClick={onOpenWalletModal}>
                Connect Wallet
              </Button>
            )}
          </div>
          <ProfileModal
            isOpen={isOpenProfileModal}
            onClose={onCloseProfileModal}
          />
          <WalletModal
            isOpen={isOpenWalletModal}
            onClose={onCloseWalletModal}
          />
        </div>
      </div>
    </header>
  )
}
