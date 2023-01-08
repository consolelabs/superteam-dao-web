import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { Token, TokenAccount as _TokenAccount } from '@raydium-io/raydium-sdk'

export interface TokenAccount {
  publicKey?: PublicKey
  mint?: PublicKey
  isAssociated?: boolean
  amount: BN
  isNative: boolean
}

export type TokenAccountRawInfo = _TokenAccount

export interface TokenJson {
  symbol: string
  name: string
  mint: string
  decimals: number
  extensions: {
    coingeckoId?: string
  }
  icon: string
}

export interface RaydiumTokenListJsonInfo {
  official: TokenJson[]
  unOfficial: TokenJson[]
  unNamed: Pick<TokenJson, 'mint' | 'decimals'>[]
  blacklist: string[]
}

export type SplToken = Token & {
  icon: string
  /** 'sol' or mint. for `<TokenSelector>` */
  id: string
  extensions: {
    [key in 'coingeckoId' | 'website' | 'whitepaper']?: string
  }
  userAdded?: boolean // only if token is added by user
  symbol?: string // overwrite type Currency readonly limit
  name?: string // overwrite type Currency readonly limit
}

export interface QuantumSOLToken extends SplToken {
  isQuantumSOL: true
  collapseTo?: 'sol' | 'wsol'
}
