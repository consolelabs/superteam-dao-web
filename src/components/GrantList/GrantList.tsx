import { GrantItem } from 'components/GrantItem'
import { GrantItemType } from 'types/GrantItem'

export interface GrantListProps {
  data: GrantItemType[]
}

export function GrantList(props: GrantListProps) {
  const { data } = props
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <GrantItem key={item.name} grant={item} />
      ))}
    </div>
  )
}
