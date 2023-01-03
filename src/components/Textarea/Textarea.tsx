import React from 'react'
import cx from 'classnames'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean
  filled?: boolean
  readOnly?: boolean
  value?: string
  invalid?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      fullWidth = false,
      disabled = false,
      invalid = false,
      onFocus,
      onBlur,
      className,
      ...rest
    } = props

    return (
      <div
        className={cx('relative inline-flex', {
          'w-full': fullWidth,
        })}
      >
        <textarea
          className={cx(
            'focus:outline-none bg-transparent border rounded-lg px-3 py-2 appearance-none',
            'bg-white placeholder-gray-500',
            'text-sm appearance-none w-full block',
            {
              'border-red-600 text-red-900': invalid,
              'border-gray-300 text-gray-900 focus:ring-pink-500 focus:border-pink-500 focus:ring-1':
                !invalid,
            },
            className,
          )}
          {...rest}
          ref={ref}
          disabled={disabled}
        />
      </div>
    )
  },
)

export default Textarea
