import { Token } from '@raydium-io/raydium-sdk'
import { PublicKey } from '@solana/web3.js'
import { QuantumSOLToken } from 'types/solana'

export const WSOLMint = new PublicKey(
  'So11111111111111111111111111111111111111112',
)
export const SOLDecimals = 9

export const QuantumSOLVersionSOL = Object.assign(
  new Token(WSOLMint, SOLDecimals, 'SOL', 'solana'),
  {
    isQuantumSOL: true,
    isLp: false,
    official: true,
    collapseTo: 'sol',
    id: 'sol',
    icon: `https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png`,
    extensions: {
      coingeckoId: 'solana',
    },
  },
) as QuantumSOLToken

export const QuantumSOLVersionWSOL = Object.assign(
  new Token(WSOLMint, SOLDecimals, 'WSOL', 'Wrapped SOL'),
  {
    isQuantumSOL: true,
    isLp: false,
    official: true,
    collapseTo: 'wsol',
    id: String(WSOLMint),
    icon: `https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png`,
    extensions: {
      coingeckoId: 'solana',
    },
  },
) as QuantumSOLToken
