import { truncate } from '@dwarvesf/react-utils'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
  ModalTitle,
} from 'components/Modal'
import { Text } from 'components/Text'

interface Props extends ModalProps {}

const WalletInfo = () => {
  const { wallet, publicKey, disconnect } = useWallet()
  const address = String(publicKey)

  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-center space-x-2">
        <img
          src={wallet?.adapter.icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <div>
          <Text className="text-sm text-black">{wallet?.adapter.name}</Text>
          <Text className="text-sm text-pink-500">
            {truncate(address, 15, true)}
          </Text>
        </div>
      </div>
      <div className="text-center">
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
    </div>
  )
}

const WalletList = () => {
  const { wallets, select } = useWallet()

  const supportedWallets = wallets.filter(
    (w) => w.readyState !== WalletReadyState.Unsupported,
  )
  const installedWallets = supportedWallets.filter(
    (w) => w.readyState !== WalletReadyState.NotDetected,
  )
  const notInstalledWallets = supportedWallets.filter(
    (w) => w.readyState === WalletReadyState.NotDetected,
  )

  return (
    <div className="mt-5 space-y-3 max-h-[70vh] overflow-auto">
      {installedWallets.map((wallet) => (
        <Button
          key={wallet.adapter.name}
          fullWidth
          onClick={() => {
            select(wallet.adapter.name)
          }}
          className="space-x-5"
        >
          <img
            className="w-10 h-10"
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
          />
          <div className="flex-1 text-left">
            <Text className="text-xl font-bold text-black">
              {wallet.adapter.name}
            </Text>
            <Text className="text-sm text-black opacity-50">
              {wallet.readyState}
            </Text>
          </div>
        </Button>
      ))}
      {notInstalledWallets.map((wallet) => (
        <Button
          key={wallet.adapter.name}
          fullWidth
          disabled
          className="space-x-5"
        >
          <img
            className="w-10 h-10"
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
          />
          <div className="flex-1 text-left">
            <Text className="text-xl font-bold text-black">
              {wallet.adapter.name}
            </Text>
            <Text className="text-sm text-black opacity-50">
              {wallet.readyState}
            </Text>
          </div>
        </Button>
      ))}
    </div>
  )
}

export const WalletModal = (props: Props) => {
  const { isOpen, onClose } = props
  const { connected } = useWallet()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="max-w-sm">
        <ModalCloseButton />
        <ModalTitle className="text-xl">
          {connected ? 'Wallet Info' : 'Connect wallet'}
        </ModalTitle>

        {connected ? <WalletInfo /> : <WalletList />}
      </ModalContent>
    </Modal>
  )
}
