/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */
export type CustomError =
  | SenderInvalidStateAccount
  | ReceiverInvalidStateAccount
  | InvalidAccount
  | TagsTooLong
  | TitleTooLong
  | SubtitleTooLong
  | ImageTooLong
  | TransactionHashIsNotValid
  | InvalidProposal

export class SenderInvalidStateAccount extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = 'SenderInvalidStateAccount'
  readonly msg = 'Invalid sender'

  constructor(readonly logs?: string[]) {
    super('6000: Invalid sender')
  }
}

export class ReceiverInvalidStateAccount extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = 'ReceiverInvalidStateAccount'
  readonly msg = 'Invalid receiver'

  constructor(readonly logs?: string[]) {
    super('6001: Invalid receiver')
  }
}

export class InvalidAccount extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = 'InvalidAccount'
  readonly msg = 'Account is invalid'

  constructor(readonly logs?: string[]) {
    super('6002: Account is invalid')
  }
}

export class TagsTooLong extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = 'TagsTooLong'
  readonly msg = 'The provided tags should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6003: The provided tags should be 256 characters long maximum.')
  }
}

export class TitleTooLong extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = 'TitleTooLong'
  readonly msg = 'The provided content should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6004: The provided content should be 256 characters long maximum.')
  }
}

export class SubtitleTooLong extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = 'SubtitleTooLong'
  readonly msg = 'The provided subtitle should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6005: The provided subtitle should be 256 characters long maximum.')
  }
}

export class ImageTooLong extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = 'ImageTooLong'
  readonly msg = 'The provided image should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6006: The provided image should be 256 characters long maximum.')
  }
}

export class TransactionHashIsNotValid extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = 'TransactionHashIsNotValid'
  readonly msg = 'The transaction hash is needed'

  constructor(readonly logs?: string[]) {
    super('6007: The transaction hash is needed')
  }
}

export class InvalidProposal extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = 'InvalidProposal'
  readonly msg = 'Proposal is invalid'

  constructor(readonly logs?: string[]) {
    super('6008: Proposal is invalid')
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new SenderInvalidStateAccount(logs)
    case 6001:
      return new ReceiverInvalidStateAccount(logs)
    case 6002:
      return new InvalidAccount(logs)
    case 6003:
      return new TagsTooLong(logs)
    case 6004:
      return new TitleTooLong(logs)
    case 6005:
      return new SubtitleTooLong(logs)
    case 6006:
      return new ImageTooLong(logs)
    case 6007:
      return new TransactionHashIsNotValid(logs)
    case 6008:
      return new InvalidProposal(logs)
  }

  return null
}
