import { Button } from 'components/Button'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Text } from 'components/Text'
import { useEffect, useState } from 'react'
import { GrantDetail } from 'types/grant'
import { MintPoW } from './MintPoW'

interface Props extends ModalProps {
  grant: GrantDetail
}

export const MintProofOfWorkModal = (props: Props) => {
  const { isOpen, onClose, grant } = props
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSuccess(false)
      }, 300)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        size="max-w-xl"
        className="px-10 py-10 bg-[#121217] border-2 border-purple-600"
      >
        <ModalCloseButton />
        <div className="mb-5 text-3xl font-bold text-center text-white">
          {success ? 'Successfully Minted' : 'Confirm to mint'}
        </div>
        {success ? (
          <div className="text-center">
            {grant.image && (
              <>
                <Text className="mb-3 text-xl text-white">Proof of work</Text>
                <div className="text-center">
                  <span className="w-[150px] h-[150px] inline-flex items-center justify-center mx-auto">
                    <img
                      src={grant.image}
                      alt="Proof of work NFT"
                      className="max-w-full max-h-full"
                    />
                  </span>
                </div>
              </>
            )}
            <Button
              className="mt-8"
              appearance="border"
              size="lg"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        ) : (
          <MintPoW onSuccess={() => setSuccess(true)} grant={grant} />
        )}
      </ModalContent>
    </Modal>
  )
}
