import { Listbox } from '@headlessui/react'
import React from 'react'
import cx from 'classnames'
import { useId } from 'hooks/useId'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'

export interface ListboxProps {
  id?: string
  value?: string[]
  onChange?: (value: string[]) => void
  invalid?: boolean
  className?: string
  items: { key: React.Key; value: string }[]
}

export const CustomListbox = React.forwardRef<HTMLInputElement, ListboxProps>(
  (props, ref) => {
    const defaultId = `listbox-${useId()}`
    const { id = defaultId, value, onChange, invalid, className, items } = props

    return (
      <Listbox value={value} onChange={onChange}>
        <div id={id} ref={ref} className={cx('relative', className)}>
          <Listbox.Button
            className={({ open }) =>
              cx(
                'h-10 relative focus:outline-none bg-transparent border-2 border-purple-600 rounded-lg pl-3 pr-10 appearance-none text-sm w-full block text-left',
                {
                  'border-red-600 text-red-900': invalid,
                  'ring-purple-500 border-purple-500 ring-1': open,
                },
              )
            }
          >
            {({ open }) => (
              <>
                <span className="block truncate">{value}</span>
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
  },
)
