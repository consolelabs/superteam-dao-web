import React, { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { WithChildren } from 'types/common'

// const endpointUrl = 'https://solana-mainnet.rpc.extrnode.com/'

const SolanaWalletProvider = ({ children }: WithChildren) => {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

export { SolanaWalletProvider }
