import { useDisclosure } from '@dwarvesf/react-hooks'
import { Button } from 'components/Button'
import { GrantDetail } from 'types/grant'
import { EnterPoPModal } from './EnterPoPModal'

interface Props {
  grant: GrantDetail
}

export const EnterPoPButton = ({ grant }: Props) => {
  const {
    isOpen: isOpenPoPModal,
    onClose: onClosePoPModal,
    onOpen: onOpenPoPModal,
  } = useDisclosure()

  return (
    <>
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={onOpenPoPModal}
      >
        Enter PoP
      </Button>
      {isOpenPoPModal && (
        <EnterPoPModal
          isOpen={isOpenPoPModal}
          onClose={onClosePoPModal}
          grant={grant}
        />
      )}
    </>
  )
}
