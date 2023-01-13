import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from '@solana/web3.js'
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
import { toast } from 'components/Toast'
import { useGrant } from 'context/grant'
import { useProgram } from 'context/program'
import { useToken } from 'context/solana-token'
import { useState } from 'react'
import { GrantDetail } from 'types/grant'
import { findPDAProposal } from 'utils/contract/setup'
import { formatWallet } from 'utils/formatWallet'

interface Props extends ModalProps {
  grant: GrantDetail
}

export const PoPModal = (props: Props) => {
  const { isOpen, onClose, grant } = props
  const { spl, amount } = grant
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { program } = useProgram()
  const { tokens } = useToken()
  const { refreshGrant } = useGrant()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const token = tokens[String(spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = amount.div(new BN(1 * 10 ** decimals)).toNumber()

  const senPoP = async () => {
    if (!program || !publicKey) return
    try {
      setLoading(true)
      const [proposalAccount] = findPDAProposal(
        grant.sender,
        grant.identifier,
        program,
      )
      const transaction = await program.methods
        .fillTransactionHash(value)
        .accounts({
          proposal: proposalAccount,
          signer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      toast.success({
        title: 'Sunmit Proof of payment successfully',
      })
      // setTimeout(() => {
      setLoading(false)
      onClose()
      refreshGrant()
      // }, 2000)
    } catch (error: any) {
      setLoading(false)
      toast.error({
        title: 'Cannot submit Proof of payment',
        message: error?.message,
      })
    }
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
              onClick={senPoP}
            >
              Submit
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
