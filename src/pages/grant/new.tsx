import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { FormInput } from 'components/FormInput'
import { FormTextarea } from 'components/FormTextarea'
import { Layout } from 'components/Layout'
import { Logo } from 'components/Logo'
import { useToken } from 'context/solana-token'
import { FormProvider, useForm } from 'react-hook-form'
import { findPDAIdentifier, findPDAProposal } from 'utils/contract/setup'
import * as anchor from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { MINT_A_DECIMALS } from 'constants/contract'
import { useProgram } from 'context/program'
import { FormListbox } from 'components/FormListbox'
import { FormGrantAmountInput } from 'components/FormGrantAmountInput'
import { GrantAmount } from 'types/grant'
import { retry } from 'utils/retry'

const owners = ['Applicant (You)', 'Approver'] as const
type Owner = typeof owners[number]

export interface GrantData {
  title: string
  tags: string[]
  description: string
  grantAmount: GrantAmount
  approverWallet: string
  linkSubmission: string
  owner: Owner
}

const GrantPage = () => {
  const { program } = useProgram()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { allValuableTokens } = useToken()

  const formInstance = useForm<GrantData>({
    defaultValues: { owner: 'Applicant (You)' },
  })
  const { handleSubmit, getValues } = formInstance
  console.log(getValues)

  const onSubmit = async (data?: GrantData) => {
    if (!program || !publicKey || !data) return

    const grantAmount = Number(data.grantAmount.amount)
    const grantToken = allValuableTokens.find(
      (token) => token.symbol === data.grantAmount?.token,
    )
    if (Number.isNaN(grantAmount) || grantAmount <= 0 || !grantToken) return

    try {
      const [identifierAccount] = findPDAIdentifier(publicKey, program)

      const transaction = await program.methods
        .createIdentifier()
        .accounts({
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const identifierData = await retry(
        () => program.account.identifier.fetch(identifierAccount),
        2000,
        3,
      )
      console.log('[identifier account] Create result: ', identifierData)

      const mintA = grantToken.mint

      const [proposalAccount] = findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      const createProposalTx = await program.methods
        .createProposal(
          new PublicKey(data.approverWallet),
          'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
          data.title,
          '',
          mintA,
          data.tags.join(','),
          new anchor.BN(grantAmount * 10 ** grantToken.decimals),
          data.owner === 'Applicant (You)',
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
      console.log('[proposal account] Create result: ', proposalData)
    } catch (err) {
      console.log({ err })
      alert(err)
    }
  }

  const createProposal = async () => {
    if (!program || !publicKey) return

    try {
      const [identifierAccount] = findPDAIdentifier(publicKey, program)

      const transaction = await program.methods
        .createIdentifier()
        .accounts({
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction()
      await sendTransaction(transaction, connection)

      const identifierData = await retry(
        () => program.account.identifier.fetch(identifierAccount),
        2000,
        3,
      )
      console.log('[identifier account] Create result: ', identifierData)

      const mintA = new PublicKey(
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      )

      const [proposalAccount] = findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      const recipient = anchor.web3.Keypair.generate()
      const createProposalTx = await program.methods
        .createProposal(
          recipient.publicKey,
          'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
          'Orca summer Winner',
          '',
          mintA,
          'gamefi',
          new anchor.BN(1 * 10 ** MINT_A_DECIMALS),
          true,
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
      console.log('[proposal account] Create result: ', proposalData)
    } catch (err) {
      console.log({ err })
      alert(err)
    }
  }

  return (
    <Layout>
      <Card
        spacing={false}
        className="flex flex-col items-center p-6 space-y-3 text-black"
      >
        <Logo width={106} height={106} />
        <FormProvider {...formInstance}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-6 p-6">
              <div className="col-span-3">
                <FormInput
                  label="Title"
                  name="title"
                  fullWidth
                  rules={{ required: 'Required' }}
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
                  rules={{ required: 'Required' }}
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
                  items={allValuableTokens.map((t) => ({
                    key: t.id,
                    value: t.symbol!,
                  }))}
                />
              </div>
              <div className="col-span-3">
                <FormInput
                  label="Approver Wallet"
                  name="approverWallet"
                  fullWidth
                  rules={{ required: 'Required' }}
                />
              </div>
              <div className="col-span-6">
                <FormInput
                  label="Link Submission"
                  name="LlinkSubmission"
                  fullWidth
                  rules={{ required: 'Required' }}
                />
              </div>
              <div className="col-span-6">
                <FormListbox
                  label="Who have the authority to mint the Proof of Work?"
                  name="owner"
                  rules={{ required: 'Required' }}
                  items={owners.map((value) => ({ key: value, value }))}
                  className="text-gray-900"
                />
              </div>
            </div>
            <div className="px-5 py-2 text-center">
              <Button appearance="primary" type="submit">
                Submit
              </Button>
              <Button className="ml-2" type="button" onClick={createProposal}>
                Test
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </Layout>
  )
}

export default GrantPage
