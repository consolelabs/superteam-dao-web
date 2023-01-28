import React, { HTMLAttributes } from 'react'
import cx from 'classnames'
import { useToken } from 'context/solana-token'
import { GrantDetail } from 'types/grant'
import Link from 'next/link'
import { Label } from 'components/Label'
import { Address } from 'components/Address'
import { formatAmount } from 'utils/formatNumber'
import { SenderAction } from './SenderAction'
import { ReceiverAction } from './ReceiverAction'
import { SubmitterAction } from './SubmitterAction'

export interface GrantItemProps {
  grant: GrantDetail
  filter: 'sent' | 'received' | 'submitted'
}

export function GrantItem({
  grant,
  filter,
  className,
  ...props
}: GrantItemProps & HTMLAttributes<HTMLDivElement>) {
  const {
    sender,
    receiver,
    transaction,
    spl,
    amount,
    tags,
    image,
    title,
    account,
  } = grant
  const { tokens } = useToken()
  const token = tokens[String(spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = amount.toNumber() / 10 ** decimals

  return (
    <div
      className={cx(
        'flex py-6 px-8 border-slate-600 border-2 rounded-lg items-center space-x-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center flex-1">
        <img
          src={image}
          className="flex-none object-cover w-20 h-20 mr-8 overflow-hidden border-2 border-purple-600 rounded-lg -indent-20"
          alt=""
        />
        <div>
          <Link
            href={`/grant-detail/${String(account)}`}
            passHref
            legacyBehavior
          >
            <a className="text-xl underline hover:text-purple-600">{title}</a>
          </Link>
          <div className="flex items-center mt-2 space-x-2">
            <Label className="min-w-max">Transaction ID</Label>
            <Address
              href={`https://solscan.io/tx/${transaction}`}
              value={transaction}
            />
          </div>
          <div className="flex flex-wrap">
            <div className="flex items-center mr-2 space-x-2">
              <Label className="min-w-max">From</Label>
              <Address
                href={`https://solscan.io/account/${String(sender)}`}
                value={String(sender)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="min-w-max">To</Label>
              <Address
                href={`https://solscan.io/account/${String(receiver)}`}
                value={String(receiver)}
              />
            </div>
          </div>
          <ul className="flex flex-wrap mt-3">
            {tags.split(',').map((tag) => (
              <li
                key={tag}
                className="inline-flex px-3 py-1 mb-1 mr-1 overflow-hidden text-xs bg-purple-600 border border-purple-600 rounded-lg bg-opacity-20"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/6 font-semibold text-left">
        {formatAmount(tokenAmount)} {symbol}
      </div>
      <div className="w-1/6 text-end">
        {
          {
            sent: <SenderAction grant={grant} />,
            received: <ReceiverAction grant={grant} />,
            submitted: <SubmitterAction grant={grant} />,
          }[filter]
        }
      </div>
    </div>
  )
}
