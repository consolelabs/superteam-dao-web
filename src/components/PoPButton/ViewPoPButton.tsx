import { useDisclosure } from '@dwarvesf/react-hooks'
import { Button } from 'components/Button'
import { GrantDetail } from 'types/grant'
import { ViewPoPModal } from './ViewPoPModal'

interface Props {
  grant: GrantDetail
}

export const ViewPoPButton = ({ grant }: Props) => {
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
        View PoP
      </Button>
      {isOpenPoPModal && (
        <ViewPoPModal
          isOpen={isOpenPoPModal}
          onClose={onClosePoPModal}
          grant={grant}
        />
      )}
    </>
  )
}
