import React, { HTMLAttributes } from 'react'
import cx from 'classnames'
import { Text } from 'components/Text'
import { GrantItemType } from 'types/GrantItem'
import { formatWallet } from 'utils/formatWallet'
import { Button } from 'components/Button'

export interface GrantItemProps {
  grant: GrantItemType
}

export function GrantItem({
  grant,
  className,
  ...props
}: GrantItemProps & HTMLAttributes<HTMLDivElement>) {
  const { avatar, name, receiverWallet } = grant

  return (
    <div
      className={cx(
        'flex py-6 px-8 border-slate-600 border-2 rounded-xl items-center',
        className,
      )}
      {...props}
    >
      <div className="w-2/3 flex items-center">
        <img
          src={avatar}
          className="w-20 h-20 mr-8 flex-none rounded-full overflow-hidden"
          alt={name}
        />
        <div>
          <Text as="b" className="text-xl">
            {name}
          </Text>
          <br />
          <Text truncate className="text-slate-300 block mt-2 max-w-[10rem]">
            To {formatWallet(receiverWallet)}
          </Text>
          <ul className="flex mt-2 flex-wrap">
            {grant.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex border border-slate-300 rounded-md overflow-hidden py-1 px-3 mb-2 mr-2"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/6 text-center">
        {grant.tokenAmount} {grant.tokenSymbol}
      </div>
      <div className="w-1/6 text-end">
        <Button appearance="border" size="md">
          Cancel
        </Button>
      </div>
    </div>
  )
}
