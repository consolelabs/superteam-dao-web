import { PublicKey } from '@solana/web3.js'

export function isValidPublicKey(
  val: string | PublicKey | undefined,
): val is string {
  if (!val) return false
  if (val instanceof PublicKey) return true
  try {
    // eslint-disable-next-line no-new
    new PublicKey(val)
  } catch (err) {
    return false
  }
  return true
}
