import { Token } from '@raydium-io/raydium-sdk'
import {
  QuantumSOLVersionSOL,
  QuantumSOLVersionWSOL,
  WSOLMint,
} from 'constants/solana'
import { useFetchWithCache } from 'hooks/useFetchWithCache'
import { client } from 'libs/api'
import { SplToken, TokenJson } from 'types/solana'

export const raydiumMainnetTokenListUrl =
  'https://api.raydium.io/v2/sdk/token/raydium.mainnet.json'

export function createSplToken(token: TokenJson): SplToken {
  const { mint, symbol, name, decimals, ...rest } = token

  const splToken = Object.assign(
    new Token(mint, decimals, symbol, name ?? symbol),
    { icon: '', extensions: {}, id: mint },
    rest,
  )

  return splToken
}

export const useTokenList = () => {
  const { data } = useFetchWithCache('TOKEN_LIST', () => client.getTokenList())

  const tokens =
    data?.official.reduce<Record<string, SplToken>>(
      (prev, token) => ({
        ...prev,
        [String(token.mint)]: createSplToken(token),
      }),
      {},
    ) || {}

  const tokenList = [
    QuantumSOLVersionSOL,
    ...Object.values(tokens).map((token) =>
      String(token.mint) === String(WSOLMint) ? QuantumSOLVersionWSOL : token,
    ),
  ]

  return { tokens, tokenList }
}
