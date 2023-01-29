/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */
export type CustomError = InvalidMint | InvalidOwner | InvalidAmount

export class InvalidMint extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = 'InvalidMint'
  readonly msg = 'InvalidMint'

  constructor(readonly logs?: string[]) {
    super('6000: InvalidMint')
  }
}

export class InvalidOwner extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = 'InvalidOwner'
  readonly msg = 'InvalidOwner'

  constructor(readonly logs?: string[]) {
    super('6001: InvalidOwner')
  }
}

export class InvalidAmount extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = 'InvalidAmount'
  readonly msg = 'InvalidAmount'

  constructor(readonly logs?: string[]) {
    super('6002: InvalidAmount')
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidMint(logs)
    case 6001:
      return new InvalidOwner(logs)
    case 6002:
      return new InvalidAmount(logs)
  }

  return null
}
