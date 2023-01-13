import BN from 'bn.js'
import { Button } from 'components/Button'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
  ModalTitle,
} from 'components/Modal'
import { Text } from 'components/Text'
import { useToken } from 'context/solana-token'
import { useGrantActions } from 'hooks/useGrantActions'
import { useState } from 'react'
import { GrantDetail } from 'types/grant'

interface Props extends ModalProps {
  grant: GrantDetail
}

export const ViewPoPModal = (props: Props) => {
  const { isOpen, onClose, grant } = props
  const { spl, amount } = grant
  const { tokens } = useToken()
  const { approvePoP, rejectPoP } = useGrantActions(grant)
  const [loading, setLoading] = useState<'approve' | 'reject'>()

  const token = tokens[String(spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = amount.div(new BN(1 * 10 ** decimals)).toNumber()

  const handleClick = (action: 'approve' | 'reject') => {
    setLoading(action)
    const handler = action === 'approve' ? approvePoP : rejectPoP
    handler(
      () => {
        setLoading(undefined)
        onClose()
      },
      () => {
        setLoading(undefined)
      },
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="max-w-md" className="bg-[#121217]">
        <ModalCloseButton />
        <ModalTitle className="text-xl">
          <Text>Proof of payment</Text>
        </ModalTitle>

        <div className="mt-10 text-center">
          <div className="flex justify-center space-x-1">
            <Text className="text-sm text-white">Proof of payment:</Text>
            <Text as="strong" className="text-sm text-white">
              {Intl.NumberFormat().format(tokenAmount)} {symbol}
            </Text>
          </div>
          <div className="flex justify-center space-x-1">
            <Text className="text-sm text-white">Amount:</Text>
            <Text as="strong" className="text-sm text-white">
              {grant.transaction}
            </Text>
          </div>
          <div className="mt-10 space-x-3">
            <Button
              appearance="primary"
              disabled={!!loading}
              loading={loading === 'approve'}
              onClick={() => handleClick('approve')}
            >
              Approve
            </Button>
            <Button
              appearance="secondary"
              disabled={!!loading}
              loading={loading === 'reject'}
              onClick={() => handleClick('reject')}
            >
              Reject
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
