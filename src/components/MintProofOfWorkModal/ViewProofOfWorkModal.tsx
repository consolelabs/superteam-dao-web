import { Address } from 'components/Address'
import { Button } from 'components/Button'
import { Label } from 'components/Label'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Text } from 'components/Text'
import { NftData } from 'context/grant'

interface Props extends ModalProps {
  nftData: NftData
}

export const ViewProofOfWorkModal = (props: Props) => {
  const { isOpen, onClose, nftData } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        size="max-w-xl"
        className="px-10 py-10 bg-[#121217] border-2 border-purple-600"
      >
        <ModalCloseButton />
        <div className="mb-5 text-3xl font-bold text-center text-white">
          Proof of work
        </div>
        <div className="text-center text-white">
          <Text className="text-xl">{nftData.nft.name}</Text>
          <div className="flex justify-center space-x-2">
            <Label>Mint Address</Label>
            <Address
              href={`https://solscan.io/token/${nftData.nft.mintAddress}?cluster=devnet`}
              value={String(nftData.nft.mintAddress)}
            />
          </div>
          {nftData.uriData?.image && (
            <div className="flex justify-center mt-5">
              <img
                src={nftData.uriData?.image}
                alt="Proof of work NFT"
                className="w-[150px] h-[150px]"
              />
            </div>
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
      </ModalContent>
    </Modal>
  )
}
