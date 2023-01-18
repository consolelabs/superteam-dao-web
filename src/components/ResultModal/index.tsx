import BN from 'bn.js'
import { Address } from 'components/Address'
import { Button } from 'components/Button'
import { Label } from 'components/Label'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Text } from 'components/Text'
import Link from 'next/link'

interface Props extends ModalProps {
  result: { data?: any; error?: any }
  token: {
    icon: string
    decimals: number
    symbol: string
  }
}

export const ResultModal = (props: Props) => {
  const { isOpen, onClose, result, token } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="max-w-sm" className="py-10 space-y-5 text-center">
        <ModalCloseButton />
        <Text className="text-xl text-black">
          {result.data ? 'Submitted successfully' : 'Something went wrong'}
        </Text>
        {result.data ? (
          <div className="text-sm text-left text-black">
            {result.data.image && (
              <div className="flex justify-center pb-5">
                <img
                  src={result.data.image}
                  alt=""
                  className="object-cover border-2 border-purple-600 rounded-lg cursor-pointer w-28 h-28 hover:ring-purple-500 hover:border-purple-500 hover:ring-1"
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Label>Transaction</Label>
              {result.data.transaction ? (
                <Address
                  truncate={false}
                  href={`https://solscan.io/tx/${result.data.transaction}`}
                  value={result.data.transaction}
                />
              ) : (
                '-'
              )}
            </div>
            <div className="flex space-x-2">
              <Label>Title</Label>
              <Text className="text-black truncate">
                {result.data.title || '-'}
              </Text>
            </div>
            <div className="flex space-x-2">
              <Label>Description</Label>
              <Text className="text-black truncate">
                {result.data.subtitle || '-'}
              </Text>
            </div>
            <div className="flex space-x-2">
              <Label>Tag</Label>
              <Text className="text-black truncate">
                {result.data.tags || '-'}
              </Text>
            </div>
            <div className="flex space-x-2">
              <Label>Sender</Label>
              {result.data.sender ? (
                <Address
                  href={`https://solscan.io/account/${result.data.sender}`}
                  value={String(result.data.sender)}
                />
              ) : (
                '-'
              )}
            </div>
            <div className="flex space-x-2">
              <Label>Receiver</Label>
              {result.data.receiver ? (
                <Address
                  href={`https://solscan.io/account/${result.data.receiver}`}
                  value={String(result.data.receiver)}
                />
              ) : (
                '-'
              )}
            </div>
            <div className="flex items-center space-x-2 w-36">
              <Label>Amount</Label>
              <img src={token.icon} alt="" className="w-5 h-5" />
              <Text as="strong" className="text-black">
                {Intl.NumberFormat().format(
                  new BN(result.data.amount || 0)
                    .div(new BN(10 ** token.decimals))
                    .toNumber(),
                )}
              </Text>
              <Text className="text-black">{token.symbol}</Text>
            </div>
          </div>
        ) : (
          result.error?.message && (
            <Text className="text-sm text-black truncate whitespace-pre-wrap">
              {result.error?.message}
            </Text>
          )
        )}
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </ModalContent>
    </Modal>
  )
}
