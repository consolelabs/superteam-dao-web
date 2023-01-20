import { useClipboard } from '@dwarvesf/react-hooks'
import { IconCheck } from 'components/icons/components/IconCheck'
import { IconCopy } from 'components/icons/components/IconCopy'
import { Text } from 'components/Text'
import Link from 'next/link'
import { formatWallet } from 'utils/formatWallet'

interface Props {
  value: string
  href?: string
  truncate?: boolean
  copy?: boolean
}

export const Address = ({
  value,
  href,
  truncate = true,
  copy = true,
}: Props) => {
  const { onCopy, hasCopied } = useClipboard(value)
  const displayValue = truncate ? formatWallet(value) : value

  return (
    <div className="flex items-center space-x-1 overflow-hidden text-sm">
      {href ? (
        <Link href={href}>
          <a className="truncate hover:text-pink-500" target="_blank">
            {displayValue}
          </a>
        </Link>
      ) : (
        <Text className="truncate">{displayValue}</Text>
      )}
      {copy && (
        <div>
          {hasCopied ? (
            <IconCheck className="w-4 h-4 text-purple-600 cursor-pointer stroke-2" />
          ) : (
            <IconCopy
              className="w-4 h-4 text-purple-600 cursor-pointer stroke-2"
              onClick={onCopy}
            />
          )}
        </div>
      )}
    </div>
  )
}
