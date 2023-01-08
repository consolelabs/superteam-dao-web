import { createContext } from '@dwarvesf/react-utils'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { WithChildren } from 'types/common'
import idl from 'idl/superteam_dao_contract.json'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PROGRAM_ID } from 'idl/programId'
import { useMemo } from 'react'

interface ProgramValues {
  program?: Program
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

  return (
    <Provider
      value={{
        program,
      }}
    >
      {children}
    </Provider>
  )
}

export { ProgramProvider, useProgram }
