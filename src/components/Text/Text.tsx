import { createElement, HTMLAttributes } from 'react'
import cx from 'classnames'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'small' | 'b' | 'strong' | 'i' | 'em' | 'h1'
  truncate?: boolean
}

export const Text: React.FC<TextProps> = (props) => {
  const { className = 'text-white', truncate, as = 'p', ...rest } = props
  const classNames = []
  if (truncate) {
    classNames.push('truncate')
  }

  return createElement(as, { className: cx(className, classNames), ...rest })
}
