import { truncate } from '@dwarvesf/react-utils'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Heading } from 'components/Heading'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useToken } from 'context/solana-token'
import dynamic from 'next/dynamic'

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
    <div className="flex flex-col max-w-sm space-y-3">
      {installedWallets.map((wallet) => (
        <Card
          key={wallet.adapter.name}
          className="flex items-center justify-between space-x-3 space-y-2 border border-transparent cursor-pointer hover:border-gray-300"
          shadow
          onClick={() => {
            select(wallet.adapter.name)
          }}
        >
          <img
            className="w-10 h-10"
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
          />
          <div className="flex-1">
            <Text className="text-xl font-bold text-black">
              {wallet.adapter.name}
            </Text>
            <Text className="text-sm text-black opacity-50">
              {wallet.readyState}
            </Text>
          </div>
        </Card>
      ))}
      {notInstalledWallets.map((wallet) => (
        <Card
          key={wallet.adapter.name}
          className="flex items-center justify-between space-x-3 space-y-2 bg-gray-200 border border-transparent cursor-not-allowed"
          shadow
        >
          <img
            className="w-10 h-10"
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
          />
          <div className="flex-1">
            <Text className="text-xl font-bold text-black">
              {wallet.adapter.name}
            </Text>
            <Text className="text-sm text-black opacity-50">
              {wallet.readyState}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  )
}

const WalletListDynamic = dynamic(async () => WalletList, { ssr: false })

const WalletInfo = () => {
  const { publicKey, disconnect } = useWallet()
  const { balances, allSelectableTokens } = useToken()

  const address = String(publicKey)

  return (
    <div className="max-w-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <Text>Wallet:</Text>
          <Text className="text-pink-500">{truncate(address, 15, true)}</Text>
        </div>
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
      <div className="space-y-3">
        {allSelectableTokens.map((token) => (
          <Card key={token.id} className="flex items-center space-x-3">
            <img src={token.icon} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <Text className="text-black">{token.symbol}</Text>
              <Text className="text-black">
                {balances[token.id]?.toExact()}
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const ConnectWalletPage = () => {
  const { connected, connecting } = useWallet()

  if (connecting) {
    return (
      <Layout>
        <Text>connecting...</Text>
      </Layout>
    )
  }

  return (
    <Layout>
      {connected ? (
        <>
          <Heading as="h3" className="text-white">
            Current Wallet
          </Heading>
          <WalletInfo />
        </>
      ) : (
        <>
          <Heading as="h3" className="text-white">
            Connect Wallet
          </Heading>
          <WalletListDynamic />
        </>
      )}
    </Layout>
  )
}

export default ConnectWalletPage
