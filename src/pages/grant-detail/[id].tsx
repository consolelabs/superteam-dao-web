import cx from 'classnames'
import ReactHtmlParser from 'react-html-parser'
import { useDisclosure } from '@dwarvesf/react-hooks'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'
import { IconChevronUp } from 'components/icons/components/IconChevronUp'
import { formatWallet } from 'utils/formatWallet'
import { CopyElement } from 'components/CopyElement'
import { MintProofOfWorkModal } from 'components/MintProofOfWorkModal'
import { useProgram } from 'context/program'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import BN from 'bn.js'
import { toast } from 'components/Toast'
import { GrantDetail } from 'types/grant'
import { PublicKey } from '@solana/web3.js'
import {
  GRANT_STATUS,
  grantStatusMapping,
  popStatusMapping,
  POP_STATUS,
} from 'constants/grant'
import { useToken } from 'context/solana-token'

const GrantPage = () => {
  const {
    query: { id },
  } = useRouter()
  const { program } = useProgram()
  const [grant, setGrant] = useState<GrantDetail>()

  const applicantWallet = grant?.owner ? grant.sender : grant?.recipient
  const approverWallet = grant?.owner ? grant.recipient : grant?.sender

  const { tokens } = useToken()
  const token = tokens[String(grant?.spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = grant?.amount.div(new BN(1 * 10 ** decimals)).toNumber()

  useEffect(() => {
    if (!id || !program) return
    const fetchGrant = async () => {
      try {
        const grant = await program.account.proposal.fetch(id as string)
        setGrant({ ...grant, account: new PublicKey(id) } as any)
      } catch (error: any) {
        toast.error({
          title: 'Cannot fetch grant',
          message: error?.message,
        })
      }
    }
    fetchGrant()
  }, [id, program])

  const needCollapse = (grant?.subtitle || '').length > 1600

  const parsedDescription = useMemo(() => {
    if (!grant?.subtitle) {
      return null
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g

    return grant.subtitle.replace(urlRegex, (url: string) => {
      return `<a href=${url} target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-500">
          ${url}
        </a>`
    })
  }, [grant?.subtitle])

  const { isOpen: isOpenDescription, onToggle: onToggleDescription } =
    useDisclosure({ defaultIsOpen: !needCollapse })

  const {
    isOpen: isOpenModal,
    onToggle: onToggleModal,
    onClose: onCloseProofOfWorkModal,
  } = useDisclosure({
    defaultIsOpen: false,
  })

  if (!grant) return <Layout>{null}</Layout>

  return (
    <Layout>
      <div className="w-full py-10 space-y-10">
        <div className="flex items-center w-full self-top">
          <img
            src={grant.image}
            alt="title"
            className="w-[8rem] h-[8rem] mr-12 rounded-full object-cover"
          />
          <Text as="h1" className="text-4xl font-bold">
            {grant.title}
          </Text>
          <div className="ml-auto">
            <span className="flex mb-3">
              <Text as="span" className="mr-1 text-lg">
                Status:
              </Text>
              <Text as="b" className="text-lg font-bold capitalize">
                {grantStatusMapping[grant.status]}
              </Text>
            </span>
            {grant.owner &&
              grantStatusMapping[grant.status] === GRANT_STATUS.APPROVED &&
              popStatusMapping[grant.popStatus] === POP_STATUS.CONFIRMED && (
                <Button
                  appearance="border"
                  className="rounded-full"
                  onClick={onToggleModal}
                >
                  Mint Proof of Work
                </Button>
              )}
          </div>
        </div>
        <div className="flex items-center">
          <Text as="b" className="mr-32 text-3xl font-bold">
            Tags
          </Text>
          <ul className="flex flex-wrap mt-2">
            {['gamefi', 'defi', 'nft'].map((tag) => (
              <li
                key={tag}
                className="inline-flex px-3 py-1 mb-2 mr-3 overflow-hidden border rounded-md border-slate-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Text className="mb-4 text-3xl font-bold">Description</Text>
          <div
            className={cx(
              'text-lg transition-height duration-500',
              isOpenDescription || !needCollapse
                ? 'h-auto'
                : 'h-[20rem] overflow-hidden relative',
            )}
          >
            {ReactHtmlParser(parsedDescription || '')}
            {!isOpenDescription && needCollapse && (
              <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent to-slate-800">
                &nbsp;
              </div>
            )}
          </div>
          {needCollapse && (
            <div className="py-4 text-center">
              <Button
                fullWidth
                size="lg"
                appearance="link"
                Icon={isOpenDescription ? IconChevronUp : IconChevronDown}
                iconPosition="right"
                onClick={onToggleDescription}
              >
                {isOpenDescription ? 'Read less' : 'Read more'}
              </Button>
            </div>
          )}
        </div>
        <div>
          <Text className="mb-4 text-3xl font-bold">Transaction</Text>
          <div className="flex">
            <div className="w-1/2">
              <div className="mb-2">
                <Text as="span" className="mr-2 text-lg">
                  Grant amount:
                </Text>
                <Text as="span" className="text-lg font-bold text-purple-600">
                  {Intl.NumberFormat().format(tokenAmount || 0)} {symbol}
                </Text>
              </div>
              <div className="mb-2">
                <Text as="span" className="mr-2 text-lg">
                  Approver:
                </Text>
                <CopyElement
                  value={String(approverWallet)}
                  iconClass="w-5 h-5 text-purple-600 cursor-pointer stroke-2"
                >
                  <Text as="span" className="text-lg font-bold text-purple-600">
                    {formatWallet(String(approverWallet))}
                  </Text>
                </CopyElement>
              </div>
              <div className="mb-2">
                <Text as="span" className="mr-2 text-lg">
                  Applicant:
                </Text>
                <CopyElement
                  value={String(applicantWallet)}
                  iconClass="w-5 h-5 text-purple-600 cursor-pointer stroke-2"
                >
                  <Text as="span" className="text-lg font-bold text-purple-600">
                    {formatWallet(String(applicantWallet))}
                  </Text>
                </CopyElement>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MintProofOfWorkModal
        isOpen={isOpenModal}
        onClose={onCloseProofOfWorkModal}
      />
    </Layout>
  )
}

export default GrantPage
