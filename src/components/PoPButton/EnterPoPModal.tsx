import BN from 'bn.js'
import { Button } from 'components/Button'
import { Input } from 'components/Input'
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
import { formatWallet } from 'utils/formatWallet'

interface Props extends ModalProps {
  grant: GrantDetail
}

export const EnterPoPModal = (props: Props) => {
  const { isOpen, onClose, grant } = props
  const { spl, amount } = grant
  const { tokens } = useToken()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendPoP } = useGrantActions(grant)

  const token = tokens[String(spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = amount.div(new BN(1 * 10 ** decimals)).toNumber()

  const handleClick = () => {
    setLoading(true)
    sendPoP(
      value,
      () => {
        setLoading(false)
        onClose()
      },
      () => {
        setLoading(false)
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
          <Text className="text-lg text-white">
            {'Send '}
            <strong>
              {Intl.NumberFormat().format(tokenAmount)} {symbol}
            </strong>
            {' to '}
            <strong>{formatWallet(String(grant.sender))}</strong>
          </Text>
          <div className="flex flex-col items-center mt-10 space-y-3">
            <div>
              <Text className="text-left text-white">Proof of payment</Text>
              <Text className="text-sm text-left text-white">
                Insert the transaction link or upload the proof of work image
              </Text>
            </div>
            <Input
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-white"
            />
          </div>
          <div className="mt-10">
            <Button
              appearance="primary"
              disabled={!value || loading}
              loading={loading}
              onClick={handleClick}
            >
              Submit
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
