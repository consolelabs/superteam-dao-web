export type GrantItemType = {
  tags: string[]
  receiverWallet: string
  name: string
  tokenSymbol: string
  tokenAmount: number
  tokenAddress: string
  status: 'pending' | 'approved' | 'rejected'
  avatar: string
}
