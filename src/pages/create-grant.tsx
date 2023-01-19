import { Layout } from 'components/Layout'
import { useState } from 'react'
import {
  GrantForm,
  TransactionInfo,
  TransactionInput,
} from 'components/CreateGrant'

const GrantPage = () => {
  const [data, setData] = useState<TransactionInfo>()

  return (
    <Layout>
      {data ? (
        <GrantForm data={data} onBack={() => setData(undefined)} />
      ) : (
        <TransactionInput onCreate={setData} />
      )}
    </Layout>
  )
}

export default GrantPage
