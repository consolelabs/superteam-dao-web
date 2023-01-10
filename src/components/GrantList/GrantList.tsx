import { GrantItem } from 'components/GrantItem'
import { ProposalFields } from 'idl/accounts'

export interface GrantListProps {
  data: ProposalFields[]
  filter: 'sender' | 'recipient'
}

export function GrantList(props: GrantListProps) {
  const { data, filter } = props
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <GrantItem
          key={item.identifier.toString()}
          grant={item}
          filter={filter}
        />
      ))}
    </div>
  )
}
