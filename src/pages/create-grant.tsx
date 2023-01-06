import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { FormInput } from 'components/FormInput'
import { FormTextarea } from 'components/FormTextarea'
import { Layout } from 'components/Layout'
import { useToken } from 'context/solana-token'
import { FormProvider, useForm } from 'react-hook-form'
import { findPDAIdentifier, findPDAProposal } from 'utils/contract/setup'
import * as anchor from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useProgram } from 'context/program'
import { FormListbox } from 'components/FormListbox'
import { FormGrantAmountInput } from 'components/FormGrantAmountInput'
import { GrantAmount } from 'types/grant'
import { retry } from 'utils/retry'
import { isValidPublicKey } from 'utils/publicKey'
import { Program } from '@project-serum/anchor'
import { useState } from 'react'
import { useDisclosure } from '@dwarvesf/react-hooks'
import { ResultModal } from 'components/ResultModal'
import { ImageUpload } from 'components/ImageUpload'
import { uploadFile } from 'utils/uploadFile'

const minters = ['Applicant (You)', 'Approver'] as const
type Minter = typeof minters[number]

export interface GrantData {
  title: string
  tags: string[]
  description: string
  grantAmount: GrantAmount
  approverWallet: string
  minter: Minter
}

const GrantPage = () => {
  const { program } = useProgram()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { grantTokens } = useToken()

  const [selectedFile, setSelectedFile] = useState<File>()
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ data?: any; error?: any }>({})
  const {
    isOpen: isOpenResultModal,
    onClose: onCloseResultModal,
    onOpen: onOpenResultModal,
  } = useDisclosure()
  const formInstance = useForm<GrantData>({
    defaultValues: {
      title: '',
      tags: [],
      description: '',
      grantAmount: { amount: '', token: '' },
      approverWallet: '',
      minter: 'Applicant (You)',
    },
  })
  const { handleSubmit } = formInstance

  const getIdentifier = async (
    program: Program,
    identifier: PublicKey,
    sender: PublicKey,
  ) => {
    try {
      const identifierData = await program.account.identifier.fetch(identifier)

      if (identifierData) {
        return identifierData
      }

      throw new Error('Identifier not found')
    } catch (error) {
      const transaction = await program.methods
        .createIdentifier()
        .accounts({
          identifier,
          sender,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const newIdentifierData = await retry(
        () => program.account.identifier.fetch(identifier),
        2000,
        3,
      )
      return newIdentifierData
    }
  }

  const onSubmit = async (data?: GrantData) => {
    if (!program || !publicKey || !data) return

    const grantAmount = Number(data.grantAmount.amount)
    const grantToken = grantTokens.find(
      (token) => token.symbol === data.grantAmount?.token,
    )
    if (Number.isNaN(grantAmount) || grantAmount <= 0 || !grantToken) return

    try {
      setSubmitting(true)

      const image = selectedFile ? (await uploadFile(selectedFile)) || '' : ''

      const [identifierAccount] = findPDAIdentifier(publicKey, program)

      const identifierData = await getIdentifier(
        program,
        identifierAccount,
        publicKey,
      )

      const mintA = grantToken.mint

      const [proposalAccount] = findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      const createProposalTx = await program.methods
        .createProposal(
          new PublicKey(data.approverWallet),
          image,
          data.title,
          data.description,
          mintA,
          data.tags.join(','),
          new anchor.BN(grantAmount * 10 ** grantToken.decimals),
          data.minter === 'Applicant (You)',
        )
        .accounts({
          proposal: proposalAccount,
          identifier: identifierAccount,
          sender: publicKey,
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
    <Layout>
      <div className="flex flex-col items-center w-full p-6 space-y-3">
        <ImageUpload {...{ selectedFile, setSelectedFile }} />
        <FormProvider {...formInstance}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-6 p-6">
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
              <div className="col-span-3">
                <FormGrantAmountInput
                  label="Grant Amount"
                  name="grantAmount"
                  rules={{
                    validate: (data?: GrantAmount) =>
                      !data?.amount || !data?.token ? 'Required' : undefined,
                  }}
                  items={grantTokens.map((t) => ({
                    key: t.id,
                    value: t.symbol!,
                    icon: t.icon,
                  }))}
                />
              </div>
              <div className="col-span-3">
                <FormInput
                  label="Approver Wallet"
                  name="approverWallet"
                  fullWidth
                  rules={{
                    validate: (data?: string) =>
                      isValidPublicKey(data) ? undefined : 'Required',
                  }}
                />
              </div>
              <div className="col-span-6">
                <FormListbox
                  label="Who have the authority to mint the Proof of Work?"
                  name="minter"
                  rules={{ required: 'Required' }}
                  items={minters.map((value) => ({ key: value, value }))}
                  className="text-gray-900"
                />
              </div>
            </div>
            <div className="px-5 py-2 text-center">
              <Button appearance="primary" type="submit" disabled={submitting}>
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <ResultModal
        isOpen={isOpenResultModal}
        onClose={onCloseResultModal}
        title={result.data ? 'Submitted successfully' : 'Something went wrong'}
      />
    </Layout>
  )
}

export default GrantPage
