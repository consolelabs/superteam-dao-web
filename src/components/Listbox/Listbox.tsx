import { Listbox } from '@headlessui/react'
import React, { Fragment } from 'react'
import cx from 'classnames'
import { useId } from 'hooks/useId'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'
import { IconCheck } from 'components/icons/components/IconCheck'

export interface ListboxProps {
  id?: string
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  invalid?: boolean
  className?: string
  items: {
    key: React.Key
    value: string | number | boolean
  }[]
  multiple?: boolean
  placeholder?: string
}

export const CustomListbox = React.forwardRef<HTMLInputElement, ListboxProps>(
  (props, ref) => {
    const defaultId = `listbox-${useId()}`
    const {
      id = defaultId,
      value,
      onChange,
      invalid,
      className,
      items,
      multiple,
      placeholder,
    } = props
    const displayValue = Array.isArray(value) ? value?.join(', ') : value

    return (
      <Listbox value={value} onChange={onChange} multiple={multiple}>
        <div id={id} ref={ref} className={cx('relative', className)}>
          <Listbox.Button
            className={({ open }) =>
              cx(
                'h-10 relative text-white focus:outline-none bg-transparent border-2 border-purple-600 rounded-lg pl-3 pr-10 appearance-none text-sm w-full block text-left',
                {
                  'border-red-600 text-red-900': invalid,
                  'ring-purple-500 border-purple-500 ring-1': open,
                },
              )
            }
          >
            {({ open }) => (
              <>
                <span
                  className={
                    displayValue
                      ? 'block truncate'
                      : 'block truncate text-slate-500'
                  }
                >
                  {displayValue || placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-purple-600 pointer-events-none">
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
              <Listbox.Option key={item.key} value={item.value} as={Fragment}>
                {({ selected, active }) => (
                  <li
                    className={cx(
                      'relative cursor-default select-none py-1 text-sm pl-10 pr-4',
                      active
                        ? 'bg-purple-500 bg-opacity-10 text-black'
                        : 'text-gray-900',
                    )}
                  >
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500">
                        <IconCheck className="w-4 h-4" />
                      </span>
                    ) : null}
                    {item.value}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    )
  },
)
