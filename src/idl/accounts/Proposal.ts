import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ProposalFields {
  recipient: PublicKey
  sender: PublicKey
  status: number
  owner: boolean
  spl: PublicKey
  amount: BN
  tags: string
  transaction: string | null
  image: string
  title: string
  subtitle: string
  identifier: BN
}

export interface ProposalJSON {
  recipient: string
  sender: string
  status: number
  owner: boolean
  spl: string
  amount: string
  tags: string
  transaction: string | null
  image: string
  title: string
  subtitle: string
  identifier: string
}

export class Proposal {
  readonly recipient: PublicKey
  readonly sender: PublicKey
  readonly status: number
  readonly owner: boolean
  readonly spl: PublicKey
  readonly amount: BN
  readonly tags: string
  readonly transaction: string | null
  readonly image: string
  readonly title: string
  readonly subtitle: string
  readonly identifier: BN

  static readonly discriminator = Buffer.from([
    26, 94, 189, 187, 116, 136, 53, 33,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey('recipient'),
    borsh.publicKey('sender'),
    borsh.u8('status'),
    borsh.bool('owner'),
    borsh.publicKey('spl'),
    borsh.u64('amount'),
    borsh.str('tags'),
    borsh.option(borsh.str(), 'transaction'),
    borsh.str('image'),
    borsh.str('title'),
    borsh.str('subtitle'),
    borsh.u64('identifier'),
  ])

  constructor(fields: ProposalFields) {
    this.recipient = fields.recipient
    this.sender = fields.sender
    this.status = fields.status
    this.owner = fields.owner
    this.spl = fields.spl
    this.amount = fields.amount
    this.tags = fields.tags
    this.transaction = fields.transaction
    this.image = fields.image
    this.title = fields.title
    this.subtitle = fields.subtitle
    this.identifier = fields.identifier
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
  ): Promise<Proposal | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
  ): Promise<Array<Proposal | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Proposal {
    if (!data.slice(0, 8).equals(Proposal.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = Proposal.layout.decode(data.slice(8))

    return new Proposal({
      recipient: dec.recipient,
      sender: dec.sender,
      status: dec.status,
      owner: dec.owner,
      spl: dec.spl,
      amount: dec.amount,
      tags: dec.tags,
      transaction: dec.transaction,
      image: dec.image,
      title: dec.title,
      subtitle: dec.subtitle,
      identifier: dec.identifier,
    })
  }

  toJSON(): ProposalJSON {
    return {
      recipient: this.recipient.toString(),
      sender: this.sender.toString(),
      status: this.status,
      owner: this.owner,
      spl: this.spl.toString(),
      amount: this.amount.toString(),
      tags: this.tags,
      transaction: this.transaction,
      image: this.image,
      title: this.title,
      subtitle: this.subtitle,
      identifier: this.identifier.toString(),
    }
  }

  static fromJSON(obj: ProposalJSON): Proposal {
    return new Proposal({
      recipient: new PublicKey(obj.recipient),
      sender: new PublicKey(obj.sender),
      status: obj.status,
      owner: obj.owner,
      spl: new PublicKey(obj.spl),
      amount: new BN(obj.amount),
      tags: obj.tags,
      transaction: obj.transaction,
      image: obj.image,
      title: obj.title,
      subtitle: obj.subtitle,
      identifier: new BN(obj.identifier),
    })
  }
}
