import { useDebounce } from '@dwarvesf/react-hooks'
import { Heading } from 'components/Heading'
import { Input } from 'components/Input'
import { Label } from 'components/Label'
import { Text } from 'components/Text'
import { useFetchWithCache } from 'hooks/useFetchWithCache'
import { client } from 'libs/api'
import { useState } from 'react'
import { TransactionInfo, TransactionItem } from './TransactionItem'

interface Props {
  onCreate: (item: TransactionInfo) => void
}

export const TransactionInput = ({ onCreate }: Props) => {
  const [transactionId, setTransactionId] = useState('')
  const debounceId = useDebounce(transactionId, 300)
  const { data, error, isLoading } = useFetchWithCache(
    ['TRANSACTION', debounceId],
    () =>
      debounceId
        ? client.getTransaction(debounceId)
        : { innerInstructions: null },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  )
  //   const transactionData =
  //     !isLoading &&
  //     !error &&
  //     data?.unknownTransfers?.flatMap((each: any) => each.event)
  const transactionData =
    !isLoading &&
    !error &&
    data?.innerInstructions
      ?.flatMap((each: any) => each.parsedInstructions)
      ?.map((each: any) => each.extra)

  return (
    <div className="flex flex-col items-center w-full p-6 text-sm">
      <Heading as="h3">Create new Grant</Heading>
      <div className="w-full mt-6 space-y-2">
        <Label htmlFor="transaction-id-input">Transaction ID</Label>
        <Input
          id="transaction-id-input"
          fullWidth
          invalid={!!error}
          onChange={(e) => {
            setTransactionId(e.target.value)
          }}
        />
      </div>
      {transactionData?.length ? (
        <div className="w-full mt-6 space-y-2">
          <Label>Transaction Detail</Label>
          {transactionData?.map((data: any, index: number) => (
            <TransactionItem
              key={index}
              data={{ ...data, transactionId }}
              onCreate={onCreate}
            />
          ))}
        </div>
      ) : (
        <div className="w-full mt-6">
          <Text>No transaction found</Text>
        </div>
      )}
    </div>
  )
}
