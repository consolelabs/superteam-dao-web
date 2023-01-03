import { createContext } from '@dwarvesf/react-utils'
import { TokenAmount } from '@raydium-io/raydium-sdk'
import BN from 'bn.js'
import { QuantumSOLVersionSOL, QuantumSOLVersionWSOL } from 'constants/solana'
import { useTokenAccounts } from 'hooks/solana/useTokenAccounts'
import { useTokenList } from 'hooks/solana/useTokenList'
import { WithChildren } from 'types/common'
import { SplToken, TokenAccount, TokenAccountRawInfo } from 'types/solana'
import { parseBalanceFromTokenAccount } from 'utils/solana/parseBalanceFromTokenAccount'

interface TokenValues {
  tokens: Record<string, SplToken>
  tokenList: SplToken[]
  allTokenAccounts: TokenAccount[]
  rawTokenAccounts: TokenAccountRawInfo[]
  solBalance?: BN
  allWsolBalance?: BN
  pureBalances: Record<string, TokenAmount>
  balances: Record<string, TokenAmount>
  allSelectableTokens: SplToken[]
  allValuableTokens: SplToken[]
}

const [Provider, useToken] = createContext<TokenValues>({
  name: 'token',
})

const SolanaTokenProvider = ({ children }: WithChildren) => {
  const { tokens, tokenList } = useTokenList()
  const { allTokenAccounts, rawTokenAccounts } = useTokenAccounts()
  const { solBalance, allWsolBalance, pureBalances, balances } =
    parseBalanceFromTokenAccount({ tokens, allTokenAccounts })

  const allSelectableTokens = [
    QuantumSOLVersionSOL,
    QuantumSOLVersionWSOL,
    ...Object.values(pureBalances)
      .sort((a, b) => (a.raw.lt(b.raw) ? 1 : -1))
      .map((t) => tokens[String(t.token.mint)]),
  ]

  const allValuableTokens = allSelectableTokens.filter(
    (t) => balances[t.id] && !balances[t.id].isZero(),
  )

  return (
    <Provider
      value={{
        tokens,
        tokenList,
        allTokenAccounts,
        rawTokenAccounts,
        solBalance,
        allWsolBalance,
        pureBalances,
        balances,
        allSelectableTokens,
        allValuableTokens,
      }}
    >
      {children}
    </Provider>
  )
}

export { SolanaTokenProvider, useToken }
