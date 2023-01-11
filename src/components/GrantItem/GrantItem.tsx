import React, { HTMLAttributes } from 'react'
import cx from 'classnames'
import { Text } from 'components/Text'
import { formatWallet } from 'utils/formatWallet'
import { Button } from 'components/Button'
import { useToken } from 'context/solana-token'
import BN from 'bn.js'
import { GrantDetail } from 'types/grant'
import Link from 'next/link'
import { SenderAction } from './SenderAction'

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
  const { sender, recipient, spl, amount, tags, image, title, account } = grant
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
          className="flex-none w-20 h-20 mr-8 overflow-hidden border-2 border-purple-600 rounded-full -indent-20"
          alt=""
        />
        <div>
          <Text as="b" className="text-xl">
            {title}
          </Text>
          <Text
            truncate
            className="text-slate-300 block max-w-[10rem] text-sm mt-2"
          >
            From {formatWallet(String(sender))}
          </Text>
          <Text truncate className="text-slate-300 block max-w-[10rem] text-sm">
            To {formatWallet(String(recipient))}
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
      <div className="w-fit text-end">
        {filter === 'sender' ? (
          <SenderAction grant={grant} />
        ) : (
          <Link href={`/grant-detail/${String(account)}`}>
            <Button appearance="link" size="md" className="text-purple-600">
              View
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
