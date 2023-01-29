import { useWallet } from '@solana/wallet-adapter-react'
import { GrantItem } from 'components/GrantItem'
import { GrantDetail } from 'types/grant'

export interface GrantListProps {
  data: GrantDetail[]
  filter: 'submitted' | 'other'
}

export function GrantList(props: GrantListProps) {
  const { data, filter } = props
  const { publicKey } = useWallet()

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const itemFilter =
          String(item.sender) === String(publicKey) ? 'sent' : 'received'
        return (
          <GrantItem
            key={String(item.account)}
            grant={item}
            filter={filter === 'submitted' ? 'submitted' : itemFilter}
          />
        )
      })}
    </div>
  )
}
