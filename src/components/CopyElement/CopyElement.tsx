import cx from 'classnames'
import { useClipboard } from '@dwarvesf/react-hooks'
import { IconCheck } from 'components/icons/components/IconCheck'
import { IconCopy } from 'components/icons/components/IconCopy'

export interface CopyElementProps {
  children: React.ReactNode
  iconClass: string
  value: string
  className?: string
}
export const CopyElement: React.FC<CopyElementProps> = ({
  children,
  iconClass,
  value,
  className,
  ...rest
}) => {
  const { onCopy, hasCopied } = useClipboard(value)

  return (
    <div
      className={cx('inline-flex items-center space-x-1', className)}
      {...rest}
    >
      {children}
      {hasCopied ? (
        <IconCheck className={iconClass} />
      ) : (
        <IconCopy className={iconClass} onClick={onCopy} />
      )}
    </div>
  )
}
