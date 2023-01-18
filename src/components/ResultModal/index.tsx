import { Button } from 'components/Button'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Text } from 'components/Text'
import Link from 'next/link'

interface Props extends ModalProps {
  title: string
  message?: string
}

export const ResultModal = (props: Props) => {
  const { isOpen, onClose, title, message } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent size="max-w-sm" className="py-10 space-y-5 text-center">
        <ModalCloseButton />
        <Text className="text-xl text-black">{title}</Text>
        {message && (
          <Text className="text-sm text-black truncate whitespace-pre-wrap">
            {message}
          </Text>
        )}
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </ModalContent>
    </Modal>
  )
}
