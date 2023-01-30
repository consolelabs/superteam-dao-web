import { useDebounce } from '@dwarvesf/react-hooks'
import { Heading } from 'components/Heading'
import { IconSpinner } from 'components/icons/components/IconSpinner'
import { Input } from 'components/Input'
import { Label } from 'components/Label'
import { Text } from 'components/Text'
import { QuantumSOLVersionSOL } from 'constants/solana'
import { client } from 'libs/api'
import { useEffect, useState } from 'react'
import { TransactionInfo, TransactionItem } from './TransactionItem'

interface Props {
  onCreate: (item: TransactionInfo) => void
}

export const TransactionInput = ({ onCreate }: Props) => {
  const [transactionId, setTransactionId] = useState('')
  const debounceId = useDebounce(transactionId, 300)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!debounceId) return
    const getTransaction = async () => {
      try {
        setLoading(true)
        setData(null)
        setError(null)
        const data = await client.getTransaction(debounceId)
        setData(data)
        setLoading(false)
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }
    getTransaction()
  }, [debounceId])

  const transactionData: Array<Omit<TransactionInfo, 'transactionId'>> =
    data?.parsedInstruction
      ?.flatMap((parsedInstruction: any, index: number) => {
        const innerInstructions = data?.innerInstructions?.find(
          (innerInstruction: any) => innerInstruction.index === index,
        )
        return (
          innerInstructions
            ? innerInstructions.parsedInstructions
            : [parsedInstruction]
        )?.filter(
          (instruction: any) =>
            instruction?.type?.includes('spl-transfer') ||
            instruction?.type?.includes('sol-transfer'),
        )
      })
      .map((instruction: any) =>
        instruction?.type?.includes('sol-transfer')
          ? {
              sourceOwner: instruction?.params?.source,
              destinationOwner: instruction?.params?.destination,
              amount: instruction?.params?.amount,
              icon: QuantumSOLVersionSOL.icon,
              decimals: QuantumSOLVersionSOL.decimals,
              symbol: QuantumSOLVersionSOL.symbol,
              tokenAddress: String(QuantumSOLVersionSOL.mint),
            }
          : instruction.extra,
      )

  return (
    <div className="flex flex-col items-center w-full p-6 text-sm">
      <Heading as="h3">Create new Grant</Heading>
      <div className="w-full mt-6 space-y-2">
        <Label htmlFor="transaction-id-input">Transaction ID</Label>
        <div className="relative">
          <Input
            id="transaction-id-input"
            fullWidth
            placeholder="Enter Transaction ID"
            onChange={(e) => {
              setTransactionId(e.target.value)
            }}
          />
          {loading && (
            <div className="absolute inset-y-0 flex items-center right-4">
              <IconSpinner />
            </div>
          )}
        </div>
      </div>
      {debounceId && !loading && !!error && (
        <Text className="w-full mt-2 text-xs italic text-red-500">
          {error.message || 'Invalid Transaction ID'}
        </Text>
      )}
      {debounceId &&
        !loading &&
        !error &&
        (transactionData?.length ? (
          <div className="w-full mt-6 space-y-2">
            <Label>Transaction Detail</Label>
            <table>
              <tbody>
                {transactionData?.map((data, index) => (
                  <TransactionItem
                    key={index}
                    data={{ ...data, transactionId }}
                    onCreate={onCreate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full mt-6">
            <Text>
              {!data
                ? 'No transactions found'
                : 'No transfer instructions found'}
            </Text>
          </div>
        ))}
    </div>
  )
}
