import { ButtonAppearance } from './types'

export interface GetAppearanceButtonStylesTypes {
  appearance?: ButtonAppearance
  disabled?: boolean
  active?: boolean
}

export function getAppearanceButtonStyles({
  appearance = 'primary',
  disabled = false,
  active = false,
}: GetAppearanceButtonStylesTypes) {
  const classNames = ['font-medium']
  const focusRing = 'focus:ring-2 focus:ring-offset-2 focus:outline-none'

  if (appearance !== 'link' && appearance !== 'border') {
    classNames.push('rounded-md shadow-sm border')
  }

  if (appearance === 'default') {
    if (!disabled) {
      classNames.push(
        'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-pink-500',
      )
      classNames.push(focusRing)
    } else if (disabled) {
      classNames.push('bg-gray-100 text-gray-400')
    }
  } else if (appearance === 'primary') {
    if (!disabled) {
      classNames.push('border-transparent text-white')
    } else if (disabled) {
      classNames.push('bg-gray-100 text-gray-400')
    }

    if (!active) {
      classNames.push('bg-purple-600 hover:bg-purple-700 focus:ring-purple-700')
    } else if (active) {
      classNames.push('bg-purple-700')
    }
  } else if (appearance === 'secondary') {
    if (!disabled) {
      classNames.push(
        'border-transparent text-white bg-gray-500 hover:bg-gray-600 focus:ring-gray-400',
      )
      classNames.push(focusRing)
    } else if (disabled) {
      classNames.push('bg-gray-100 text-gray-400')
    }
  } else if (appearance === 'link') {
    if (!disabled) {
      classNames.push(
        'text-slate-300 hover:text-purple-200 focus:ring-offset-0 focus:ring-0 rounded-sm',
      )
      classNames.push(focusRing)
    } else {
      classNames.push('text-gray-400')
    }
  } else if (appearance === 'border') {
    classNames.push(
      'border-purple-600 border-2 text-purple-600 hover:border-purple-700 hover:text-purple-700 focus:ring-offset-0 focus:ring-0 rounded-md overflow-hidden',
    )
    classNames.push(focusRing)
  }

  return classNames
}
