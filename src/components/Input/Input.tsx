import React from 'react'
import cx from 'classnames'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean
  filled?: boolean
  readOnly?: boolean
  value?: string
  invalid?: boolean
  type?:
    | 'text'
    | 'date'
    | 'time'
    | 'email'
    | 'number'
    | 'tel'
    | 'password'
    | 'search'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      fullWidth = false,
      disabled = false,
      invalid = false,
      onFocus,
      onBlur,
      type,
      className,
      ...rest
    } = props

    return (
      <div
        className={cx('relative inline-flex', {
          'w-full': fullWidth,
        })}
      >
        <input
          className={cx(
            'h-10 focus:outline-none bg-transparent border-2 border-purple-600 rounded-lg px-3 py-2 appearance-none',
            'bg-white placeholder-slate-500',
            'text-sm appearance-none w-full block',
            {
              'border-red-600 text-red-900': invalid,
              'focus:ring-purple-500 focus:border-purple-500 focus:ring-1':
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

export default Input
