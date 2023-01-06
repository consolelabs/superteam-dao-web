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
  grantTokens: SplToken[]
}

const [Provider, useToken] = createContext<TokenValues>({
  name: 'token',
})

const SolanaTokenProvider = ({ children }: WithChildren) => {
  const { tokens, tokenList } = useTokenList()
  const { allTokenAccounts, rawTokenAccounts } = useTokenAccounts()
  const { solBalance, allWsolBalance, pureBalances, balances } =
    parseBalanceFromTokenAccount({ tokens, allTokenAccounts })

  const selectableTokens = Object.values(pureBalances)
    .sort((a, b) => (a.raw.lt(b.raw) ? 1 : -1))
    .map((t) => tokens[String(t.token.mint)])

  const allSelectableTokens = [
    QuantumSOLVersionSOL,
    QuantumSOLVersionWSOL,
    ...selectableTokens,
  ]

  const allValuableTokens = [
    QuantumSOLVersionSOL,
    QuantumSOLVersionWSOL,
    ...selectableTokens.filter(
      (t) => balances[t.id] && !balances[t.id].isZero(),
    ),
  ]

  const grantTokens = [
    QuantumSOLVersionSOL,
    QuantumSOLVersionWSOL,
    ...tokenList.filter((t) => ['USDC'].includes(String(t.symbol))),
  ]

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
        grantTokens,
      }}
    >
      {children}
    </Provider>
  )
}

export { SolanaTokenProvider, useToken }
