import { truncate } from '@dwarvesf/react-utils'

export function formatWallet(
  wallet: string,
  num: number = 8,
  middle: boolean = true,
  maskChar?: string,
) {
  return truncate(wallet, num, middle, maskChar)
}
