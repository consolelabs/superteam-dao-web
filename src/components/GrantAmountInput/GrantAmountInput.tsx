import { Listbox } from '@headlessui/react'
import React, { SyntheticEvent } from 'react'
import cx from 'classnames'
import { useId } from 'hooks/useId'
import { GrantAmount } from 'types/grant'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'
import { Input } from 'components/Input'
import { IconPlus } from 'components/icons/components/IconPlus'

export interface GrantAmountInputProps {
  id?: string
  value?: GrantAmount
  onChange?: (value: GrantAmount) => void
  invalid?: boolean
  className?: string
  items: { key: React.Key; value: string; icon?: string }[]
}

export const GrantAmountInput = React.forwardRef<
  HTMLInputElement,
  GrantAmountInputProps
>((props, ref) => {
  const defaultId = `grant-amount-${useId()}`
  const { id = defaultId, value, onChange, invalid, className, items } = props

  return (
    <Listbox
      value={value?.token}
      onChange={(token) => onChange?.({ ...value, token })}
    >
      {({ open }) => (
        <div id={id} ref={ref} className={cx('relative', className)}>
          <div
            className={cx(
              'grid group grid-cols-3 h-10 rounded-lg bg-transparent border-2 border-purple-600 text-sm w-full',
              {
                'border-red-600 text-red-900': invalid,
                'focus-within:ring-purple-500 focus-within:border-purple-500 focus-within:ring-1':
                  !invalid,
                'ring-purple-500 border-purple-500 ring-1': open,
              },
            )}
          >
            <input
              value={value?.amount}
              onChange={(e) => onChange?.({ ...value, amount: e.target.value })}
              className="h-full col-span-2 px-3 py-2 bg-transparent border-none rounded-lg focus:outline-none focus:ring-0"
            />
            <Listbox.Button
              className="col-span-1 pl-3 pr-10 text-left border-l border-purple-600"
              onFocus={(e: SyntheticEvent<HTMLButtonElement>) => {
                e.currentTarget.blur()
              }}
            >
              <span className="block truncate">{value?.token}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-purple-600 pointer-events-none">
                <IconChevronDown
                  className={cx('w-4 h-4 transition-all', {
                    'rotate-180': open,
                  })}
                />
              </span>
            </Listbox.Button>
          </div>
          <Listbox.Options className="absolute z-10 w-full py-2 mt-1 overflow-auto bg-white border rounded-lg shadow-lg max-h-60">
            {items.map((item) => (
              <Listbox.Option
                key={item.key}
                value={item.value}
                className={({ active }) =>
                  cx(
                    'relative cursor-default select-none py-1 px-4 text-sm flex items-center space-x-2',
                    active
                      ? 'bg-purple-500 bg-opacity-10 text-black'
                      : 'text-gray-900',
                  )
                }
              >
                <img src={item.icon} alt="" className="w-4 h-4 rounded-full" />
                <span>{item.value}</span>
              </Listbox.Option>
            ))}
            <div className="relative px-4 pt-2 pb-1">
              <Input
                className="w-full pr-8 text-black"
                fullWidth
                placeholder="Enter contract"
              />
              <button
                type="button"
                className="absolute inset-y-0 flex items-center text-xl text-purple-600 right-6"
              >
                <IconPlus className="w-5 h-5" />
              </button>
            </div>
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
})
