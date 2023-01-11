import { useState, useEffect } from 'react'
import { Text } from 'components/Text'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Button } from 'components/Button'

interface Props extends ModalProps {}

const MintContent = ({
  title,
  onConfirm,
}: {
  title: string
  onConfirm: () => void
}) => {
  return (
    <div className="text-center">
      <Text className="mb-3 text-white text-xl">
        Mint the{' '}
        <Text as="b" className="font-bold text-purple-500">
          {title}
        </Text>{' '}
        to a proof of work
      </Text>
      <Text className="text-white text-lg mb-8">
        Minting fee:{' '}
        <Text as="b" className="font-bold text-purple-500">
          1 SOL
        </Text>{' '}
      </Text>
      <Text className="text-pink-500 mb-3">Your balance is not enough!</Text>
      <Button appearance="border" size="lg" onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  )
}

const SuccessContent = ({ onClose }: Props) => {
  return (
    <div className="text-center">
      <Text className="mb-3 text-white text-xl">Proof of work</Text>
      <div className="text-center">
        <span className="w-[150px] h-[150px] inline-flex items-center justify-center mx-auto">
          <img
            src="https://cdn.galxe.com/galaxy/puke2earn/87edadb7-ccd4-474e-85d9-0e1eec4565af.png?optimizer=image&width=800&quality=100"
            alt="Proof of work NFT"
            className="max-w-full max-h-full"
          />
        </span>
      </div>
      <Button className="mt-8" appearance="border" size="lg" onClick={onClose}>
        Close
      </Button>
    </div>
  )
}

export const MintProofOfWorkModal = (props: Props) => {
  const { isOpen, onClose } = props
  const [mintSuccess, setMintSuccess] = useState<boolean>(false)

  useEffect(() => {
    return () => setMintSuccess(false)
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        size="max-w-xl"
        className="bg-transparent p-10 border-2 border-purple-600"
      >
        <ModalCloseButton />
        <div className="text-3xl text-center mt-3 mb-5 font-bold text-white">
          {mintSuccess ? 'Successfully Minted' : 'Confirm to mint'}
        </div>
        {mintSuccess ? (
          <SuccessContent {...props} />
        ) : (
          <MintContent onConfirm={() => setMintSuccess(true)} title="Title" />
        )}
      </ModalContent>
    </Modal>
  )
}
