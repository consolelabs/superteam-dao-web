import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import { Button } from 'components/Button'
import { Text } from 'components/Text'
import { toast } from 'components/Toast'
import { useProgram } from 'context/program'
import { useState } from 'react'
import { GrantDetail } from 'types/grant'
import {
  FreezeNft,
  getMasterEditionPDA,
  getMetadataPDA,
} from 'utils/contract/freeze_nft'
import { uploadContent } from 'utils/uploadFile'

interface Props {
  grant: GrantDetail
  onSuccess: () => void
}

export const MintPoW = ({ grant, onSuccess }: Props) => {
  const [status, setStatus] = useState<
    'init' | 'uploading' | 'minting' | 'error'
  >('init')
  const { publicKey, sendTransaction } = useWallet()
  const { nftProgram } = useProgram()
  const { connection } = useConnection()

  const loading = status === 'uploading' || status === 'minting'
  const json = {
    name: grant.title,
    description: grant.subtitle,
    image:
      grant.image ||
      'https://arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4',
    account: String(grant.account),
    attributes: [
      {
        trait_type: 'Tags',
        value: grant.tags,
      },
    ],
  }

  const mintPoW = async () => {
    if (!publicKey || !nftProgram) return
    try {
      setStatus('uploading')
      const uri = await uploadContent(
        'nft.json',
        Buffer.from(JSON.stringify(json)).toString('base64'),
      )
      if (!uri) {
        throw new Error('Error when uploading json info')
      }
      setStatus('minting')
      const mint = Keypair.generate()
      const ata = await getAssociatedTokenAddress(mint.publicKey, publicKey)
      const tokenMetadataPubkey = getMetadataPDA(mint.publicKey)
      const masterEditionPubkey = getMasterEditionPDA(mint.publicKey)
      const freezeNft = await FreezeNft(publicKey, mint.publicKey, nftProgram)
      const tx = new Transaction()
      tx.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          lamports: await getMinimumBalanceForRentExemptMint(connection),
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          0,
          publicKey,
          publicKey,
        ),
        createAssociatedTokenAccountInstruction(
          publicKey,
          ata,
          publicKey,
          mint.publicKey,
        ),
        createMintToCheckedInstruction(mint.publicKey, ata, publicKey, 1, 0),
        createCreateMetadataAccountV2Instruction(
          {
            metadata: tokenMetadataPubkey,
            mint: mint.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV2: {
              data: {
                name: grant.title,
                symbol: grant.title,
                uri,
                sellerFeeBasisPoints: 100,
                creators: [
                  {
                    address: publicKey,
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
            updateAuthority: publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            metadata: tokenMetadataPubkey,
          },
          {
            createMasterEditionArgs: {
              maxSupply: 0,
            },
          },
        ),
        freezeNft,
      )
      await sendTransaction(tx, connection, {
        signers: [mint],
      })
      onSuccess()
    } catch (error: any) {
      setStatus('error')
      toast.error({
        title: 'Cannot mint Proof of Work',
        message: error.message,
      })
    }
  }

  return (
    <div className="text-center">
      <Text className="mb-3 text-xl text-white">
        Mint the{' '}
        <Text as="b" className="font-bold text-purple-500">
          {grant.title}
        </Text>{' '}
        to a proof of work
      </Text>
      <Button
        appearance="primary"
        className="mt-5"
        onClick={mintPoW}
        disabled={loading}
        loading={loading}
      >
        Confirm
      </Button>
    </div>
  )
}
