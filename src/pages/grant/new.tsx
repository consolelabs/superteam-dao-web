import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { FormInput } from 'components/FormInput'
import { FormTextarea } from 'components/FormTextarea'
import { Layout } from 'components/Layout'
import { Logo } from 'components/Logo'
import { useToken } from 'context/solana-token'
import { FormProvider, useForm } from 'react-hook-form'
import { PROGRAM_ID } from 'idl/programId'
import { findPDAIdentifier, findPDAProposal } from 'utils/contract/setup'
import * as anchor from '@project-serum/anchor'
import { SystemProgram } from '@solana/web3.js'
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { MINT_A_DECIMALS } from 'constants/contract'
import { useProgram } from 'context/program'
import { FormListbox } from 'components/FormListbox'
import { FormGrantAmountInput } from 'components/FormGrantAmountInput'
import { GrantAmount } from 'types/grant'

export interface GrantData {
  title: string
  tag: string
  description: string
  grantAmount: GrantAmount
  approverWallet: string
  linkSubmission: string
}

const GrantPage = () => {
  const { program } = useProgram()
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { allValuableTokens } = useToken()

  const formInstance = useForm<GrantData>({
    defaultValues: {},
  })
  const { handleSubmit } = formInstance

  const onSubmit = async (data: GrantData) => {
    alert(JSON.stringify(data))
  }

  const payer = anchor.web3.Keypair.generate()
  // const sender = anchor.web3.Keypair.generate()
  const recipient = anchor.web3.Keypair.generate()

  const createProposal = async () => {
    if (!program || !publicKey) return

    try {
      const [identifierAccount] = findPDAIdentifier(publicKey, program)

      await program.methods
        .createIdentifier()
        .accounts({
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc()

      let identifierData = await program.account.identifier.fetch(
        identifierAccount,
      )
      console.log('[identifier account] Create result: ', identifierData)

      const mintA = await createMint(
        connection,
        payer,
        payer.publicKey,
        null,
        MINT_A_DECIMALS,
        undefined,
        undefined,
        TOKEN_PROGRAM_ID,
      )

      const [proposalAccount] = findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      await program.methods
        .createProposal(
          recipient.publicKey,
          'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
          'Orca summer Winner',
          '',
          mintA,
          'gamefi',
          new anchor.BN(100 * 10 ** MINT_A_DECIMALS),
        )
        .accounts({
          proposal: proposalAccount,
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc()

      const dataProposal = await program.account.proposal.fetch(proposalAccount)
      console.log('[proposal account] Create result: ', dataProposal)

      identifierData = await program.account.identifier.fetch(identifierAccount)

      const [proposalAccount1] = findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      await program.methods
        .createProposal(
          recipient.publicKey,
          'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
          'Orca summer 2nd',
          '',
          mintA,
          'defi',
          new anchor.BN(100 * 10 ** MINT_A_DECIMALS),
        )
        .accounts({
          proposal: proposalAccount1,
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc()

      const dataProposal1 = await program.account.proposal.fetch(
        proposalAccount1,
      )
      console.log('[proposal account 1] Create result: ', dataProposal1)

      identifierData = await program.account.identifier.fetch(identifierAccount)
      const [proposalAccount2] = await findPDAProposal(
        publicKey,
        identifierData.count as any,
        program,
      )

      await program.methods
        .createProposal(
          recipient.publicKey,
          'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
          'Orca summer 3rd',
          '',
          mintA,
          'orca',
          new anchor.BN(100 * 10 ** MINT_A_DECIMALS),
        )
        .accounts({
          proposal: proposalAccount2,
          identifier: identifierAccount,
          sender: publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc()

      const dataProposal2 = await program.account.proposal.fetch(
        proposalAccount2,
      )
      console.log('[proposal account 2] Create result: ', dataProposal2)
    } catch (err) {
      console.log({ err })
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
                  name="tag"
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
            </div>
            <div className="px-5 py-2 text-center">
              <Button appearance="primary" type="submit">
                Submit
              </Button>
              <Button className="ml-2" type="button" onClick={createProposal}>
                Create Proposal
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </Layout>
  )
}

export default GrantPage
