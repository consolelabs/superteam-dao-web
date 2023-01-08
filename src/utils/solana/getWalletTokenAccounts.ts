import {
  Spl,
  SPL_ACCOUNT_LAYOUT,
  TOKEN_PROGRAM_ID,
} from '@raydium-io/raydium-sdk'
import {
  Connection,
  GetTokenAccountsByOwnerConfig,
  PublicKey,
} from '@solana/web3.js'
import { BN } from 'bn.js'
import { TokenAccount, TokenAccountRawInfo } from 'types/solana'

export const getWalletTokenAccounts = async ({
  connection,
  owner,
  config,
}: {
  connection: Connection
  owner: PublicKey
  config?: GetTokenAccountsByOwnerConfig
}): Promise<{ accounts: TokenAccount[]; rawInfos: TokenAccountRawInfo[] }> => {
  const defaultConfig = {}
  const customConfig = { ...defaultConfig, ...config }

  const solReq = connection.getAccountInfo(owner, customConfig.commitment)
  const tokenReq = connection.getTokenAccountsByOwner(
    owner,
    { programId: TOKEN_PROGRAM_ID },
    customConfig.commitment,
  )

  const [solResp, tokenResp] = await Promise.all([solReq, tokenReq])

  const accounts: TokenAccount[] = []
  const rawInfos: TokenAccountRawInfo[] = []

  for (const { pubkey, account } of tokenResp.value) {
    // double check layout length
    if (account.data.length !== SPL_ACCOUNT_LAYOUT.span) {
      continue
    }

    const rawResult = SPL_ACCOUNT_LAYOUT.decode(account.data)
    const { mint, amount } = rawResult

    // eslint-disable-next-line no-await-in-loop
    const associatedTokenAddress = await Spl.getAssociatedTokenAccount({
      mint,
      owner,
    })
    accounts.push({
      publicKey: pubkey,
      mint,
      isAssociated: associatedTokenAddress.equals(pubkey),
      amount,
      isNative: false,
    })
    rawInfos.push({ pubkey, accountInfo: rawResult })
  }

  accounts.push({
    amount: new BN(solResp ? solResp.lamports : 0),
    isNative: true,
  })

  return { accounts, rawInfos }
}
