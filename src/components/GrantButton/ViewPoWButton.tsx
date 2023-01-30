import { useDisclosure } from '@dwarvesf/react-hooks'
import { Button } from 'components/Button'
import { ViewProofOfWorkModal } from 'components/MintProofOfWorkModal'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const ViewPoWButton = ({ grant }: Props) => {
  const {
    isOpen: isOpenProofOfWorkModal,
    onOpen: onOpenProofOfWorkModal,
    onClose: onCloseProofOfWorkModal,
  } = useDisclosure()

  return (
    <>
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={onOpenProofOfWorkModal}
      >
        View PoW
      </Button>
      <ViewProofOfWorkModal
        grant={grant}
        isOpen={isOpenProofOfWorkModal}
        onClose={onCloseProofOfWorkModal}
      />
    </>
  )
}
