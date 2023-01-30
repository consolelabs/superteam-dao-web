import { useDisclosure } from '@dwarvesf/react-hooks'
import { Button } from 'components/Button'
import {
  MintProofOfWorkModal,
  ViewProofOfWorkModal,
} from 'components/MintProofOfWorkModal'
import { Text } from 'components/Text'
import { useGrant } from 'context/grant'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const MintPoWButton = ({ grant }: Props) => {
  const { nfts, nftLoading } = useGrant()
  const {
    isOpen: isOpenProofOfWorkModal,
    onOpen: onOpenProofOfWorkModal,
    onClose: onCloseProofOfWorkModal,
  } = useDisclosure()

  const nftData = nfts.find(
    (each) => each.uriData?.account === String(grant.account),
  )

  if (nftLoading) {
    return <Text className="text-xs italic">Loading</Text>
  }

  return (
    <>
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={onOpenProofOfWorkModal}
      >
        {nftData ? 'View PoW' : 'Mint PoW'}
      </Button>
      {nftData ? (
        <ViewProofOfWorkModal
          nftData={nftData}
          isOpen={isOpenProofOfWorkModal}
          onClose={onCloseProofOfWorkModal}
        />
      ) : (
        <MintProofOfWorkModal
          grant={grant}
          isOpen={isOpenProofOfWorkModal}
          onClose={onCloseProofOfWorkModal}
        />
      )}
    </>
  )
}
