import React, { HTMLAttributes } from 'react'
import cx from 'classnames'
import { Text } from 'components/Text'
import { formatWallet } from 'utils/formatWallet'
import { useToken } from 'context/solana-token'
import BN from 'bn.js'
import { GrantDetail } from 'types/grant'
import Link from 'next/link'
import { SenderAction } from './SenderAction'
import { ReceiverAction } from './ReceiverAction'

export interface GrantItemProps {
  grant: GrantDetail
  filter: 'sender' | 'recipient'
}

export function GrantItem({
  grant,
  filter,
  className,
  ...props
}: GrantItemProps & HTMLAttributes<HTMLDivElement>) {
  const { sender, receiver, spl, amount, tags, image, title, account } = grant
  const { tokens } = useToken()
  const token = tokens[String(spl)] || {}
  const { decimals = 0, symbol } = token
  const tokenAmount = amount.div(new BN(1 * 10 ** decimals)).toNumber()

  return (
    <div
      className={cx(
        'flex py-6 px-8 border-slate-600 border-2 rounded-xl items-center space-x-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center flex-1">
        <img
          src={image}
          className="flex-none object-cover w-20 h-20 mr-8 overflow-hidden border-2 border-purple-600 rounded-full -indent-20"
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
          <Text
            truncate
            className="text-slate-300 block max-w-[10rem] text-sm mt-2"
          >
            From {formatWallet(String(sender))}
          </Text>
          <Text truncate className="text-slate-300 block max-w-[10rem] text-sm">
            To {formatWallet(String(receiver))}
          </Text>
          <ul className="flex flex-wrap mt-2">
            {tags.split(',').map((tag) => (
              <li
                key={tag}
                className="inline-flex px-3 py-1 mb-1 mr-1 overflow-hidden text-xs bg-purple-600 border border-purple-600 rounded-md bg-opacity-20"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/6 font-semibold text-left">
        {Intl.NumberFormat().format(tokenAmount)} {symbol}
      </div>
      <div className="w-1/6 text-end">
        {filter === 'sender' ? (
          <SenderAction grant={grant} />
        ) : (
          <ReceiverAction grant={grant} />
        )}
      </div>
    </div>
  )
}
