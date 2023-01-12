import { GrantItem } from 'components/GrantItem'
import { GrantDetail } from 'types/grant'

export interface GrantListProps {
  data: GrantDetail[]
}

export function GrantList(props: GrantListProps) {
  const { data } = props
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <GrantItem key={String(item.account)} grant={item} />
      ))}
    </div>
  )
}
