import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { Address } from 'components/Address'
import { Button } from 'components/Button'
import { Label } from 'components/Label'
import { Text } from 'components/Text'
import { toast } from 'components/Toast'
import { useProgram } from 'context/program'
import { useState } from 'react'
import { findPDAProposal, getProposal } from 'utils/contract/setup'
import { formatAmount } from 'utils/formatNumber'

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
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)

  const onClick = async (data: TransactionInfo) => {
    if (!program) return
    try {
      setLoading(true)
      setCreated(false)
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
        setCreated(true)
        throw Error('Grant is already created')
      }
      onCreate?.(data)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      toast.error({
        title: 'Cannot create grant',
        message: error.message,
      })
    }
  }

  if (!isTransactionInfo(data)) return null

  return (
    <tr className="text-sm">
      <td>
        <div className="flex items-center pr-10 space-x-1">
          <Label>Sender</Label>
          <Address
            href={`https://solscan.io/account/${data.sourceOwner}`}
            value={data.sourceOwner}
          />
        </div>
      </td>
      <td>
        <div className="flex items-center pr-10 space-x-1">
          <Label>To Receiver</Label>
          <Address
            href={`https://solscan.io/account/${data.destinationOwner}`}
            value={data.destinationOwner}
          />
        </div>
      </td>
      <td>
        <div className="flex items-center pr-10 space-x-1">
          <img src={data.icon} alt="" className="w-5 h-5" />
          <Text as="strong">
            {formatAmount(new BN(data.amount).toNumber() / 10 ** data.decimals)}
          </Text>
          <Address
            truncate={false}
            copy={false}
            href={`https://solscan.io/token/${data.tokenAddress}`}
            value={data.symbol}
          />
        </div>
      </td>
      <td className="py-0.5">
        <Button
          appearance="border"
          size="sm"
          onClick={() => onClick(data)}
          loading={loading}
          disabled={loading || created}
        >
          {created ? 'Created' : 'Create grant'}
        </Button>
      </td>
    </tr>
  )
}
