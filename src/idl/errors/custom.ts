export type CustomError =
  | SenderInvalidStateAccount
  | RecipientInvalidStateAccount
  | NotEnoughLamport
  | NotEnoughSplToken
  | OwnerInvalidTokenAccount
  | StatusPendingInvalid
  | OwnerInvalidAccount
  | InvalidAccount
  | InvalidMintAccount
  | TagsTooLong
  | TitleTooLong
  | SubtitleTooLong
  | ImageTooLong

export class SenderInvalidStateAccount extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = 'SenderInvalidStateAccount'
  readonly msg = 'Invalid sender'

  constructor(readonly logs?: string[]) {
    super('6000: Invalid sender')
  }
}

export class RecipientInvalidStateAccount extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = 'RecipientInvalidStateAccount'
  readonly msg = 'Invalid recipient'

  constructor(readonly logs?: string[]) {
    super('6001: Invalid recipient')
  }
}

export class NotEnoughLamport extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = 'NotEnoughLamport'
  readonly msg = 'Not enough lamport'

  constructor(readonly logs?: string[]) {
    super('6002: Not enough lamport')
  }
}

export class NotEnoughSplToken extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = 'NotEnoughSplToken'
  readonly msg = 'Not enough spl token'

  constructor(readonly logs?: string[]) {
    super('6003: Not enough spl token')
  }
}

export class OwnerInvalidTokenAccount extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = 'OwnerInvalidTokenAccount'
  readonly msg = 'Invalid owner associated token account'

  constructor(readonly logs?: string[]) {
    super('6004: Invalid owner associated token account')
  }
}

export class StatusPendingInvalid extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = 'StatusPendingInvalid'
  readonly msg = 'proposal is not pending'

  constructor(readonly logs?: string[]) {
    super('6005: proposal is not pending')
  }
}

export class OwnerInvalidAccount extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = 'OwnerInvalidAccount'
  readonly msg = 'Invalid owner account'

  constructor(readonly logs?: string[]) {
    super('6006: Invalid owner account')
  }
}

export class InvalidAccount extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = 'InvalidAccount'
  readonly msg = 'Account is invalid'

  constructor(readonly logs?: string[]) {
    super('6007: Account is invalid')
  }
}

export class InvalidMintAccount extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = 'InvalidMintAccount'
  readonly msg = 'Mint Account is invalid'

  constructor(readonly logs?: string[]) {
    super('6008: Mint Account is invalid')
  }
}

export class TagsTooLong extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = 'TagsTooLong'
  readonly msg = 'The provided tags should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6009: The provided tags should be 256 characters long maximum.')
  }
}

export class TitleTooLong extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = 'TitleTooLong'
  readonly msg = 'The provided content should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6010: The provided content should be 256 characters long maximum.')
  }
}

export class SubtitleTooLong extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = 'SubtitleTooLong'
  readonly msg = 'The provided subtitle should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6011: The provided subtitle should be 256 characters long maximum.')
  }
}

export class ImageTooLong extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = 'ImageTooLong'
  readonly msg = 'The provided image should be 256 characters long maximum.'

  constructor(readonly logs?: string[]) {
    super('6012: The provided image should be 256 characters long maximum.')
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new SenderInvalidStateAccount(logs)
    case 6001:
      return new RecipientInvalidStateAccount(logs)
    case 6002:
      return new NotEnoughLamport(logs)
    case 6003:
      return new NotEnoughSplToken(logs)
    case 6004:
      return new OwnerInvalidTokenAccount(logs)
    case 6005:
      return new StatusPendingInvalid(logs)
    case 6006:
      return new OwnerInvalidAccount(logs)
    case 6007:
      return new InvalidAccount(logs)
    case 6008:
      return new InvalidMintAccount(logs)
    case 6009:
      return new TagsTooLong(logs)
    case 6010:
      return new TitleTooLong(logs)
    case 6011:
      return new SubtitleTooLong(logs)
    case 6012:
      return new ImageTooLong(logs)
  }

  return null
}
