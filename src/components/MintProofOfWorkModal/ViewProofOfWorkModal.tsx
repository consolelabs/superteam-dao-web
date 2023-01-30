import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from '@metaplex-foundation/js'
import { useConnection } from '@solana/wallet-adapter-react'
import { Address } from 'components/Address'
import { Button } from 'components/Button'
import { IconSpinner } from 'components/icons/components/IconSpinner'
import { Label } from 'components/Label'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Text } from 'components/Text'
import { useEffect, useState } from 'react'
import { GrantDetail } from 'types/grant'

interface Props extends ModalProps {
  grant: GrantDetail
}

export const ViewProofOfWorkModal = (props: Props) => {
  const { isOpen, onClose, grant } = props
  const { connection } = useConnection()
  const [nft, setNft] = useState<Sft | SftWithToken | Nft | NftWithToken>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const findNft = async () => {
      try {
        setLoading(true)
        const metaplex = new Metaplex(connection)
        const nft = await metaplex.nfts().findByMint({ mintAddress: grant.nft })
        setNft(nft)
        setLoading(false)
      } catch (error) {
        setNft(undefined)
        setLoading(false)
      }
    }
    findNft()
  }, [connection, grant.nft, isOpen])

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
        {!nft && loading ? (
          <div className="flex justify-center p-5">
            <IconSpinner className="w-10 h-10 text-white" />
          </div>
        ) : (
          <div className="text-center text-white">
            <Text className="text-xl">{nft?.name}</Text>
            <div className="flex justify-center space-x-2">
              <Label>Mint Address</Label>
              <Address
                href={`https://solscan.io/token/${String(
                  nft?.address,
                )}?cluster=devnet`}
                value={String(nft?.address)}
              />
            </div>
            {nft?.json?.image && (
              <div className="flex justify-center mt-5">
                <img
                  src={nft.json.image}
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
        )}
      </ModalContent>
    </Modal>
  )
}
