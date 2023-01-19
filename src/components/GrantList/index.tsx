import { GrantItem } from 'components/GrantItem'
import { GrantDetail } from 'types/grant'

export interface GrantListProps {
  data: GrantDetail[]
  filter: 'sender' | 'recipient'
}

export function GrantList(props: GrantListProps) {
  const { data, filter } = props
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <GrantItem key={String(item.account)} grant={item} filter={filter} />
      ))}
    </div>
  )
}
