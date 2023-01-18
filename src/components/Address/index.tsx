import { useClipboard } from '@dwarvesf/react-hooks'
import { IconCheck } from 'components/icons/components/IconCheck'
import { IconCopy } from 'components/icons/components/IconCopy'
import { Text } from 'components/Text'
import Link from 'next/link'
import { formatWallet } from 'utils/formatWallet'

interface Props {
  value: string
  href?: string
}

export const Address = ({ value, href }: Props) => {
  const { onCopy, hasCopied } = useClipboard(value)

  return (
    <div className="flex items-center space-x-1 text-sm">
      {href ? (
        <Link href={href}>
          <a className="text-pink-500" target="_blank">
            {formatWallet(value)}
          </a>
        </Link>
      ) : (
        <Text>{formatWallet(value)}</Text>
      )}
      {hasCopied ? (
        <IconCheck className="w-4 h-4 text-purple-600 cursor-pointer stroke-2" />
      ) : (
        <IconCopy
          className="w-4 h-4 text-purple-600 cursor-pointer stroke-2"
          onClick={onCopy}
        />
      )}
    </div>
  )
}
