import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ProposalFields {
  receiver: PublicKey
  sender: PublicKey
  transaction: string
  submitter: PublicKey
  receiverStatus: number
  senderStatus: number
  spl: PublicKey
  amount: BN
  tags: string
  image: string
  title: string
  subtitle: string
}

export interface ProposalJSON {
  receiver: string
  sender: string
  transaction: string
  submitter: string
  receiverStatus: number
  senderStatus: number
  spl: string
  amount: string
  tags: string
  image: string
  title: string
  subtitle: string
}

export class Proposal {
  readonly receiver: PublicKey
  readonly sender: PublicKey
  readonly transaction: string
  readonly submitter: PublicKey
  readonly receiverStatus: number
  readonly senderStatus: number
  readonly spl: PublicKey
  readonly amount: BN
  readonly tags: string
  readonly image: string
  readonly title: string
  readonly subtitle: string

  static readonly discriminator = Buffer.from([
    26, 94, 189, 187, 116, 136, 53, 33,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey('receiver'),
    borsh.publicKey('sender'),
    borsh.str('transaction'),
    borsh.publicKey('submitter'),
    borsh.u8('receiverStatus'),
    borsh.u8('senderStatus'),
    borsh.publicKey('spl'),
    borsh.u64('amount'),
    borsh.str('tags'),
    borsh.str('image'),
    borsh.str('title'),
    borsh.str('subtitle'),
  ])

  constructor(fields: ProposalFields) {
    this.receiver = fields.receiver
    this.sender = fields.sender
    this.transaction = fields.transaction
    this.submitter = fields.submitter
    this.receiverStatus = fields.receiverStatus
    this.senderStatus = fields.senderStatus
    this.spl = fields.spl
    this.amount = fields.amount
    this.tags = fields.tags
    this.image = fields.image
    this.title = fields.title
    this.subtitle = fields.subtitle
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
      receiver: dec.receiver,
      sender: dec.sender,
      transaction: dec.transaction,
      submitter: dec.submitter,
      receiverStatus: dec.receiverStatus,
      senderStatus: dec.senderStatus,
      spl: dec.spl,
      amount: dec.amount,
      tags: dec.tags,
      image: dec.image,
      title: dec.title,
      subtitle: dec.subtitle,
    })
  }

  toJSON(): ProposalJSON {
    return {
      receiver: this.receiver.toString(),
      sender: this.sender.toString(),
      transaction: this.transaction,
      submitter: this.submitter.toString(),
      receiverStatus: this.receiverStatus,
      senderStatus: this.senderStatus,
      spl: this.spl.toString(),
      amount: this.amount.toString(),
      tags: this.tags,
      image: this.image,
      title: this.title,
      subtitle: this.subtitle,
    }
  }

  static fromJSON(obj: ProposalJSON): Proposal {
    return new Proposal({
      receiver: new PublicKey(obj.receiver),
      sender: new PublicKey(obj.sender),
      transaction: obj.transaction,
      submitter: new PublicKey(obj.submitter),
      receiverStatus: obj.receiverStatus,
      senderStatus: obj.senderStatus,
      spl: new PublicKey(obj.spl),
      amount: new BN(obj.amount),
      tags: obj.tags,
      image: obj.image,
      title: obj.title,
      subtitle: obj.subtitle,
    })
  }
}
