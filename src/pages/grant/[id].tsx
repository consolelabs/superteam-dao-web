import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useProgram } from 'context/program'
import { PublicKey } from '@solana/web3.js'
import { GrantDetail } from 'types/grant'
import { toast } from 'components/Toast'
import { getGrantStatus } from 'utils/grant'
import { capitalizeFirstLetter } from 'utils/capitalizeFirstLetter'
import { IconSpinner } from 'components/icons/components/IconSpinner'
import { useToken } from 'context/solana-token'
import { formatAmount } from 'utils/formatNumber'
import { Address } from 'components/Address'
import { useWallet } from '@solana/wallet-adapter-react'
import { SenderAction } from 'components/GrantItem/SenderAction'
import { ReceiverAction } from 'components/GrantItem/ReceiverAction'

const GrantDetailPage = () => {
  const {
    query: { id },
  } = useRouter()
  const { program } = useProgram()
  const { publicKey } = useWallet()
  const { tokens } = useToken()
  const [grant, setGrant] = useState<GrantDetail>()
  const [loading, setLoading] = useState(true)

  const token = tokens[String(grant?.spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = (grant?.amount.toNumber() || 0) / 10 ** decimals

  const isSender = String(publicKey) === String(grant?.sender)
  const isReceiver = !isSender && String(publicKey) === String(grant?.receiver)

  useEffect(() => {
    if (!program || !id) return
    const fetchGrant = async () => {
      try {
        setLoading(true)
        const account = new PublicKey(id)
        const data = await program.account.proposal.fetch(
          new PublicKey(account),
        )
        setGrant({ ...(data as any), account })
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        toast.error({
          title: 'Cannot fetch grant detail',
          message: error.message,
        })
      }
    }
    fetchGrant()
  }, [id, program])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center w-full p-10">
          <IconSpinner className="w-10 h-10" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full py-10">
        <div className="flex items-center w-full mb-10">
          <img
            src={grant?.image}
            alt=""
            className="w-[8rem] h-[8rem] mr-12 border-2 border-purple-600 rounded-lg indent-[8rem]"
          />
          <Text as="h1" className="flex-1 text-4xl font-bold">
            {grant?.title}
          </Text>
          <div className="flex flex-col items-end">
            <Text as="b" className="text-lg font-bold">
              {grant ? capitalizeFirstLetter(getGrantStatus(grant)) : '-'}
            </Text>
            <div>
              {isSender && grant && <SenderAction grant={grant} />}
              {isReceiver && grant && <ReceiverAction grant={grant} />}
            </div>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <Text as="b" className="mr-32 text-3xl font-bold">
            Tags
          </Text>
          <ul className="flex flex-wrap mt-2">
            {grant?.tags.split(',').map((tag) => (
              <li
                key={tag}
                className="inline-flex px-3 py-1 mb-2 mr-3 overflow-hidden text-sm bg-purple-600 border border-purple-600 rounded-lg bg-opacity-20"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        {grant?.subtitle && (
          <div className="mb-4">
            <Text className="mb-4 text-3xl font-bold">Description</Text>
            <div className="text-base duration-500 transition-height">
              {grant?.subtitle}
            </div>
          </div>
        )}
        <div>
          <Text className="mb-4 text-3xl font-bold">Transaction</Text>
          <div className="flex">
            <div className="w-1/2">
              <div className="flex items-center mb-2 space-x-2">
                <Text>Grant amount:</Text>
                <Text as="span" className="font-bold text-purple-600">
                  {formatAmount(tokenAmount)} {symbol}
                </Text>
              </div>
              <div className="flex items-center mb-2 space-x-2">
                <Text>Sender:</Text>
                {grant?.sender && (
                  <Address
                    href={`https://solscan.io/account/${String(grant.sender)}`}
                    value={String(grant.sender)}
                    size="base"
                  />
                )}
              </div>
              <div className="flex items-center mb-2 space-x-2">
                <Text>Receiver:</Text>
                {grant?.receiver && (
                  <Address
                    href={`https://solscan.io/account/${String(
                      grant.receiver,
                    )}`}
                    value={String(grant.receiver)}
                    size="base"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GrantDetailPage
