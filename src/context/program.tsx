import { createContext } from '@dwarvesf/react-utils'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { WithChildren } from 'types/common'
import idl from 'idl/superteam_dao_contract.json'
import nftIdl from 'nft-idl/idl.json'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PROGRAM_ID } from 'idl/programId'
import { useMemo } from 'react'
import { PROGRAM_FREEZE_NFT_ID } from 'nft-idl/programId'

interface ProgramValues {
  program?: Program
  nftProgram?: Program
}

const [Provider, useProgram] = createContext<ProgramValues>({
  name: 'program',
})

const ProgramProvider = ({ children }: WithChildren) => {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const provider = useMemo(
    () =>
      publicKey && signTransaction && signAllTransactions
        ? new AnchorProvider(
            connection,
            { publicKey, signTransaction, signAllTransactions },
            {
              commitment: 'processed',
            },
          )
        : undefined,
    [connection, publicKey, signAllTransactions, signTransaction],
  )

  const program = useMemo(
    () =>
      provider ? new Program(idl as any, PROGRAM_ID, provider) : undefined,
    [provider],
  )

  const nftProgram = useMemo(
    () =>
      provider
        ? new Program(nftIdl as any, PROGRAM_FREEZE_NFT_ID, provider)
        : undefined,
    [provider],
  )

  return (
    <Provider
      value={{
        program,
        nftProgram,
      }}
    >
      {children}
    </Provider>
  )
}

export { ProgramProvider, useProgram }
