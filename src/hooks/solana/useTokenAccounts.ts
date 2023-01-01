import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { startTransition, useCallback, useEffect, useState } from 'react'
import { TokenAccount, TokenAccountRawInfo } from 'types/solana'
import { inServer } from 'utils/isSSR'
import { getWalletTokenAccounts } from 'utils/solana/getWalletTokenAccounts'

export const useTokenAccounts = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [allTokenAccounts, setAllTokenAccounts] = useState<TokenAccount[]>([])
  const [rawTokenAccounts, setRawTokenAccounts] = useState<
    TokenAccountRawInfo[]
  >([])

  const fetchTokenAccounts = useCallback(
    async (connection: Connection, owner: PublicKey) => {
      const { accounts, rawInfos } = await getWalletTokenAccounts({
        connection,
        owner,
      })
      setAllTokenAccounts(accounts)
      setRawTokenAccounts(rawInfos)
    },
    [],
  )

  useEffect(() => {
    if (!connection || !publicKey) return
    fetchTokenAccounts(connection, publicKey)
  }, [connection, fetchTokenAccounts, publicKey])

  useEffect(() => {
    if (!connection || !publicKey) return
    const listenerId = connection.onAccountChange(
      new PublicKey(publicKey),
      () => fetchTokenAccounts(connection, publicKey),
      'confirmed',
    )
    return () => {
      connection.removeAccountChangeListener(listenerId)
    }
  }, [connection, fetchTokenAccounts, publicKey])

  useEffect(() => {
    const timeoutId = setInterval(() => {
      if (inServer) return
      if (document.visibilityState === 'hidden') return
      if (!connection || !publicKey) return

      console.log('useGlobalRefresh')
      startTransition(() => {
        fetchTokenAccounts(connection, publicKey)
      })
    }, 1000 * 60)
    return () => clearInterval(timeoutId)
  }, [connection, fetchTokenAccounts, publicKey])

  return { allTokenAccounts, rawTokenAccounts }
}
