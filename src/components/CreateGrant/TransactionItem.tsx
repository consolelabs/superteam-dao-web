import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { Address } from 'components/Address'
import { Button } from 'components/Button'
import { Text } from 'components/Text'
import { toast } from 'components/Toast'
import { useProgram } from 'context/program'
import { useState } from 'react'
import { findPDAProposal, getProposal } from 'utils/contract/setup'

export interface TransactionInfo {
  transactionId: string
  sourceOwner: string
  destinationOwner: string
  amount: number
  icon: string
  decimals: number
  symbol: string
  tokenAddress: string
}

interface Props {
  data?: Partial<TransactionInfo>
  onCreate?: (data: TransactionInfo) => void
}

const isTransactionInfo = (
  data?: Partial<TransactionInfo>,
): data is TransactionInfo => {
  return (
    !!data &&
    !!data.sourceOwner &&
    !!data.destinationOwner &&
    !!data.amount &&
    !!data.icon &&
    !!data.decimals &&
    !!data.symbol &&
    !!data.tokenAddress
  )
}

export const TransactionItem = (props: Props) => {
  const { data, onCreate } = props
  const { program } = useProgram()
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const onClick = async (data: TransactionInfo) => {
    if (!program) return
    try {
      setLoading(true)
      setError(null)
      const { transactionId } = data
      const sender = new PublicKey(data.sourceOwner)
      const receiver = new PublicKey(data.destinationOwner)
      const [proposalAccount] = findPDAProposal(
        transactionId.substring(0, 32),
        transactionId.substring(32, 64),
        transactionId.substring(64, 88),
        sender,
        receiver,
        program,
      )
      const proposal = await getProposal(program, proposalAccount)
      if (proposal) {
        throw Error('Grant is already created')
      }
      onCreate?.(data)
      setLoading(false)
    } catch (error: any) {
      setError(error)
      setLoading(false)
      toast.error({
        title: 'Cannot create grant',
        message: error.message,
      })
    }
  }

  if (!isTransactionInfo(data)) return null

  return (
    <div className="flex items-center text-sm">
      <Text className="flex items-center space-x-1 w-44 min-w-max">
        <strong>Sender</strong>
        <Address
          href={`https://solscan.io/account/${data.sourceOwner}`}
          value={data.sourceOwner}
        />
      </Text>
      <Text className="flex items-center w-56 space-x-1 min-w-max">
        <strong>To Receiver</strong>
        <Address
          href={`https://solscan.io/account/${data.destinationOwner}`}
          value={data.destinationOwner}
        />
      </Text>
      <div className="flex items-center space-x-1 w-36">
        <img src={data.icon} alt="" className="w-5 h-5" />
        <Text as="strong">
          {Intl.NumberFormat().format(
            new BN(data.amount).div(new BN(10 ** data.decimals)).toNumber(),
          )}
        </Text>
        <Text>{data.symbol}</Text>
      </div>
      <div>
        <Button
          appearance="border"
          size="sm"
          onClick={() => onClick(data)}
          loading={loading}
          disabled={loading || !!error}
        >
          Create grant
        </Button>
      </div>
    </div>
  )
}
