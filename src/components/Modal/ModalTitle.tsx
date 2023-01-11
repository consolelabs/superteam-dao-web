import cx from 'classnames'
import { Dialog } from '@headlessui/react'
import { WithChildren } from 'types/common'

export const ModalTitle = ({
  className,
  ...props
}: WithChildren<{ className?: string }>) => {
  return (
    <Dialog.Title
      as="h3"
      className={cx('text-gray-900 leading-snug font-medium', className)}
      {...props}
    />
  )
}
