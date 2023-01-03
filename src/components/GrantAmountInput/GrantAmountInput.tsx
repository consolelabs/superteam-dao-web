import { Listbox } from '@headlessui/react'
import React from 'react'
import cx from 'classnames'
import { useId } from 'hooks/useId'
import { GrantAmount } from 'types/grant'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'

export interface GrantAmountInputProps {
  id?: string
  value?: GrantAmount
  onChange?: (value: GrantAmount) => void
  invalid?: boolean
  className?: string
  items: { key: React.Key; value: string }[]
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
      <div id={id} ref={ref} className={cx('relative', className)}>
        <div
          className={cx(
            'grid grid-cols-3 h-10 border rounded-lg bg-white text-sm w-full',
            {
              'border-red-600 text-red-900': invalid,
              'border-gray-300 text-gray-900 focus:ring-pink-500 focus:border-pink-500 focus:ring-1':
                !invalid,
            },
          )}
        >
          <input
            value={value?.amount}
            onChange={(e) => onChange?.({ ...value, amount: e.target.value })}
            className="h-full col-span-2 px-3 py-2 border-none rounded-lg focus:outline-none focus:ring-0"
          />
          <Listbox.Button className="col-span-1 pl-3 pr-10 text-left border-l">
            {({ open }) => (
              <>
                <span className="block truncate">{value?.token}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <IconChevronDown
                    className={cx('w-4 h-4 transition-all', {
                      'rotate-180': open,
                    })}
                  />
                </span>
              </>
            )}
          </Listbox.Button>
        </div>
        <Listbox.Options className="absolute z-10 w-full py-2 mt-1 overflow-auto bg-white border rounded-lg shadow-lg max-h-60">
          {items.map((item) => (
            <Listbox.Option
              key={item.key}
              value={item.value}
              className={({ active }) =>
                cx(
                  'relative cursor-default select-none py-1 px-4 text-sm',
                  active ? 'bg-pink-500 text-white' : 'text-gray-900',
                )
              }
            >
              {item.value}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
})
