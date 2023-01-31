import React, { HTMLAttributes, useState } from 'react'
import cx from 'classnames'
import { useToken } from 'context/solana-token'
import { GrantDetail } from 'types/grant'
import Link from 'next/link'
import { Label } from 'components/Label'
import { Address } from 'components/Address'
import { formatAmount } from 'utils/formatNumber'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
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
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [size, setSize] = useState({ width: 400, height: 400 })

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
        <div className="flex-none w-20 h-20 mr-8 overflow-hidden border-2 border-purple-600 rounded-lg">
          <Image
            src={image}
            width={80}
            height={80}
            objectFit="cover"
            alt=""
            onClick={() => setIsViewerOpen(!!image)}
            className={image ? 'cursor-pointer' : undefined}
          />
        </div>
        <Transition show={isViewerOpen}>
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
            <div
              className="absolute inset-0 w-full h-full bg-black bg-opacity-70"
              onClick={() => setIsViewerOpen(false)}
              onKeyDown={() => {}}
              role="presentation"
            />
            <Transition.Child
              enter="transition duration-300"
              enterFrom="opacity-0 scale-0"
              enterTo="opacity-100 scale-100"
              leave="transition duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="relative block"
            >
              <Image
                src={image}
                alt=""
                objectFit="contain"
                width={size.width}
                height={size.height}
                onLoad={() => {
                  if (window) {
                    const size =
                      Math.min(window.innerWidth, window.innerHeight) * 0.8
                    setSize({ width: size, height: size })
                  }
                }}
              />
            </Transition.Child>
          </div>
        </Transition>
        <div>
          <Link href={`/grant/${String(account)}`} passHref legacyBehavior>
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
