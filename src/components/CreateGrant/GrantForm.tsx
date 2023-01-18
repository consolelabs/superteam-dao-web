import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { FormInput } from 'components/FormInput'
import { FormTextarea } from 'components/FormTextarea'
import { FormProvider, useForm } from 'react-hook-form'
import { findPDAProposal } from 'utils/contract/setup'
import * as anchor from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useProgram } from 'context/program'
import { FormListbox } from 'components/FormListbox'
import { retry } from 'utils/retry'
import { useState } from 'react'
import { useDisclosure } from '@dwarvesf/react-hooks'
import { ResultModal } from 'components/ResultModal'
import { ImageUpload } from 'components/ImageUpload'
import { uploadFile } from 'utils/uploadFile'
import { BN } from 'bn.js'
import { Label } from 'components/Label'
import { Text } from 'components/Text'
import { Address } from 'components/Address'
import { Program } from '@project-serum/anchor'
import { TransactionInfo } from './TransactionItem'

export interface FormData {
  image: string
  title: string
  subtitle: string
  tags: string[]
}

interface Props {
  data: TransactionInfo
}

export const GrantForm = (props: Props) => {
  const { data } = props
  const { transactionId, sourceOwner, destinationOwner, amount, tokenAddress } =
    data
  const { program } = useProgram()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const [selectedFile, setSelectedFile] = useState<File>()
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ data?: any; error?: any }>({})
  const {
    isOpen: isOpenResultModal,
    onClose: onCloseResultModal,
    onOpen: onOpenResultModal,
  } = useDisclosure()
  const formInstance = useForm<FormData>({
    defaultValues: {
      image: '',
      title: '',
      subtitle: '',
      tags: [],
    },
  })
  const { handleSubmit } = formInstance

  const getProposal = async (program: Program, proposalAccount: PublicKey) => {
    try {
      const proposal = await program.account.proposal.fetch(proposalAccount)
      return proposal
    } catch (error) {
      return null
    }
  }

  const onSubmit = async (data?: FormData) => {
    if (!program || !publicKey || !data) return

    try {
      setSubmitting(true)

      const spl = new PublicKey(tokenAddress)
      const sender = new PublicKey(sourceOwner)
      const receiver = new PublicKey(destinationOwner)
      const image = selectedFile ? (await uploadFile(selectedFile)) || '' : ''

      const [proposalAccount] = findPDAProposal(
        transactionId.substring(0, 32),
        transactionId.substring(32, 64),
        transactionId.substring(64, 88),
        sender,
        receiver,
        program,
      )
      const proposal = await getProposal(program, proposalAccount)
      if (proposal) {
        throw Error('Grant is already created')
      }

      const createProposalTx = await program.methods
        .createProposal(
          transactionId.substring(0, 32),
          transactionId.substring(32, 64),
          transactionId.substring(64, 88),
          sender,
          receiver,
          image,
          data.title,
          data.subtitle,
          spl,
          data.tags.join(','),
          new BN(amount),
        )
        .accounts({
          proposal: proposalAccount,
          payer: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction()
      await sendTransaction(createProposalTx, connection)

      const proposalData = await retry(
        () => program.account.proposal.fetch(proposalAccount),
        2000,
        3,
      )
      setResult({ data: proposalData })
    } catch (error: any) {
      setResult({ error })
    } finally {
      setSubmitting(false)
      onOpenResultModal()
    }
  }

  return (
    <div className="flex flex-col items-center w-full p-6">
      <ImageUpload {...{ selectedFile, setSelectedFile }} />
      <FormProvider {...formInstance}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-6 gap-6 p-6">
            <div className="flex col-span-6 space-x-2 truncate">
              <Label>Transaction</Label>
              <Text className="text-sm truncate">{transactionId}</Text>
            </div>
            <div className="flex col-span-6 space-x-2 truncate">
              <Text className="flex items-center space-x-1 w-44 min-w-max">
                <Label>Sender</Label>
                <Address
                  href={`https://solscan.io/account/${data.sourceOwner}`}
                  value={data.sourceOwner}
                />
              </Text>
              <Text className="flex items-center w-56 space-x-1 min-w-max">
                <Label>To Receiver</Label>
                <Address
                  href={`https://solscan.io/account/${data.destinationOwner}`}
                  value={data.destinationOwner}
                />
              </Text>
              <div className="flex items-center space-x-1 w-36">
                <img src={data.icon} alt="" className="w-5 h-5" />
                <Text as="strong">
                  {Intl.NumberFormat().format(
                    new BN(data.amount)
                      .div(new BN(10 ** data.decimals))
                      .toNumber(),
                  )}
                </Text>
                <Text>{data.symbol}</Text>
              </div>
            </div>
            <div className="col-span-3">
              <FormInput
                label="Title"
                name="title"
                fullWidth
                rules={{ required: 'Required' }}
                maxLength={100}
              />
            </div>
            <div className="col-span-3">
              <FormListbox
                label="Tag"
                name="tags"
                multiple
                rules={{ required: 'Required' }}
                items={[
                  { key: 'GameFi', value: 'GameFi' },
                  { key: 'DeFi', value: 'DeFi' },
                  { key: 'Payment', value: 'Payment' },
                  { key: 'SocialFi', value: 'SocialFi' },
                ]}
                className="text-gray-900"
              />
            </div>
            <div className="col-span-6">
              <FormTextarea
                label="Description"
                name="description"
                fullWidth
                rows={3}
                maxLength={6400}
              />
            </div>
          </div>
          <div className="px-5 py-2 text-center">
            <Button
              appearance="primary"
              type="submit"
              disabled={submitting}
              loading={submitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
      {isOpenResultModal && (
        <ResultModal
          isOpen={isOpenResultModal}
          onClose={onCloseResultModal}
          result={result}
          token={{
            icon: data.icon,
            decimals: data.decimals,
            symbol: data.symbol,
          }}
        />
      )}
    </div>
  )
}
