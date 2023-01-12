import { TokenAmount, ZERO } from '@raydium-io/raydium-sdk'
import {
  QuantumSOLVersionSOL,
  QuantumSOLVersionWSOL,
  WSOLMint,
} from 'constants/solana'
import { SplToken, TokenAccount } from 'types/solana'

export const parseBalanceFromTokenAccount = ({
  tokens,
  allTokenAccounts,
}: {
  tokens: Record<string, SplToken>
  allTokenAccounts: TokenAccount[]
}) => {
  // native sol balance
  const nativeTokenAccount = allTokenAccounts.find((t) => t.isNative)
  const solBalance = nativeTokenAccount?.amount || ZERO

  // all wsol balance
  const allWsolBalance = allTokenAccounts.reduce(
    (pre, ta) =>
      String(ta.mint) === String(WSOLMint) ? pre.add(ta.amount) : pre,
    ZERO,
  )

  const pureBalances = allTokenAccounts
    .filter((ta) => ta.isAssociated || ta.isNative)
    .reduce<Record<string, TokenAmount>>((pre, ta) => {
      const token = tokens[String(ta.mint)]
      return token
        ? { ...pre, [String(token.mint)]: new TokenAmount(token, ta.amount) }
        : pre
    }, {})

  const balances = {
    ...pureBalances,
    sol: new TokenAmount(QuantumSOLVersionSOL, solBalance),
    [String(WSOLMint)]: new TokenAmount(QuantumSOLVersionWSOL, allWsolBalance),
  }

  return { solBalance, allWsolBalance, pureBalances, balances }
}
