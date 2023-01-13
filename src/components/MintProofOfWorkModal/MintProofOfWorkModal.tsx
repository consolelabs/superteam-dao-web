import { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useDisclosure } from '@dwarvesf/react-hooks'
import { Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  PROGRAM_ID as MPL_TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV2Instruction,
  createCreateMasterEditionV3Instruction,
} from '@metaplex-foundation/mpl-token-metadata'

import { GrantDetail } from 'types/grant'
import { Text } from 'components/Text'
import { toast } from 'components/Toast'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from 'components/Modal'
import { Button } from 'components/Button'
import { useToken } from 'context/solana-token'

interface Props extends ModalProps {
  // eslint-disable-next-line react/no-unused-prop-types
  grant: GrantDetail
}

const MintContent = ({
  grant,
  onConfirm,
}: {
  grant: GrantDetail
  onConfirm: () => void
}) => {
  const { sendTransaction } = useWallet()
  const { connection } = useConnection()
  const {
    isOpen: isConfirming,
    onOpen: onConfirming,
    onOpen: onConfirmDone,
  } = useDisclosure({
    defaultIsOpen: false,
  })

  const { balances } = useToken()

  // const solBalance = balances['sol'].toExact()

  const applicantWallet = grant.owner ? grant.sender : grant.recipient

  const handleMint = useCallback(async () => {
    try {
      onConfirming()
      const mint = Keypair.generate()

      const ata = await getAssociatedTokenAddress(
        mint.publicKey,
        applicantWallet,
      )

      const [tokenMetadataPubkey] = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        MPL_TOKEN_METADATA_PROGRAM_ID,
      )

      const [masterEditionPubkey] = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
          Buffer.from('edition'),
        ],
        MPL_TOKEN_METADATA_PROGRAM_ID,
      )

      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: applicantWallet,
          newAccountPubkey: mint.publicKey,
          lamports: await getMinimumBalanceForRentExemptMint(connection),
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          0,
          applicantWallet,
          applicantWallet,
        ),
        createAssociatedTokenAccountInstruction(
          applicantWallet,
          ata,
          applicantWallet,
          mint.publicKey,
        ),
        createMintToCheckedInstruction(
          mint.publicKey,
          ata,
          applicantWallet,
          1,
          0,
        ),
        createCreateMetadataAccountV2Instruction(
          {
            metadata: tokenMetadataPubkey,
            mint: mint.publicKey,
            mintAuthority: applicantWallet,
            payer: applicantWallet,
            updateAuthority: applicantWallet,
          },
          {
            createMetadataAccountArgsV2: {
              data: {
                name: 'Fake SMS #1355',
                symbol: 'FSMB',
                uri: 'https://34c7ef24f4v2aejh75xhxy5z6ars4xv47gpsdrei6fiowptk2nqq.arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E',
                sellerFeeBasisPoints: 100,
                creators: [
                  {
                    address: applicantWallet,
                    verified: true,
                    share: 100,
                  },
                ],
                collection: null,
                uses: null,
              },
              isMutable: true,
            },
          },
        ),
        createCreateMasterEditionV3Instruction(
          {
            edition: masterEditionPubkey,
            mint: mint.publicKey,
            updateAuthority: applicantWallet,
            mintAuthority: applicantWallet,
            payer: applicantWallet,
            metadata: tokenMetadataPubkey,
          },
          {
            createMasterEditionArgs: {
              maxSupply: 0,
            },
          },
        ),
      )

      await sendTransaction(tx, connection, {
        signers: [mint],
      })

      onConfirm()
    } catch (error: any) {
      toast.error({
        title: `Cannot mint ${grant.title} proof of work`,
        message: error?.message,
      })
    }
    onConfirmDone()
  }, [
    applicantWallet,
    connection,
    grant.title,
    onConfirm,
    onConfirmDone,
    onConfirming,
    sendTransaction,
  ])

  return (
    <div className="text-center">
      <Text className="mb-3 text-white text-xl">
        Mint the{' '}
        <Text as="b" className="font-bold text-purple-500">
          {grant.title}
        </Text>{' '}
        to a proof of work
      </Text>
      <Text className="text-white text-lg mb-8">
        Minting fee:{' '}
        <Text as="b" className="font-bold text-purple-500">
          1 SOL
        </Text>{' '}
      </Text>
      {balances['sol'].isZero() && (
        <Text className="text-pink-500 mb-3">Your balance is not enough!</Text>
      )}
      <Button
        disabled={isConfirming}
        appearance="border"
        size="lg"
        onClick={handleMint}
      >
        {isConfirming ? 'Confirming' : 'Confirm'}
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
  const { isOpen, onClose, grant } = props
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
          <MintContent onConfirm={() => setMintSuccess(true)} grant={grant} />
        )}
      </ModalContent>
    </Modal>
  )
}
