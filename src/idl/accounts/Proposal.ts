import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ProposalFields {
  receiver: PublicKey
  sender: PublicKey
  submitter: PublicKey
  nft: PublicKey
  receiverStatus: number
  senderStatus: number
  spl: PublicKey
  amount: BN
  transaction: string
  tags: string
  image: string
  title: string
  subtitle: string
}

export interface ProposalJSON {
  receiver: string
  sender: string
  submitter: string
  nft: string
  receiverStatus: number
  senderStatus: number
  spl: string
  amount: string
  transaction: string
  tags: string
  image: string
  title: string
  subtitle: string
}

export class Proposal {
  readonly receiver: PublicKey
  readonly sender: PublicKey
  readonly submitter: PublicKey
  readonly nft: PublicKey
  readonly receiverStatus: number
  readonly senderStatus: number
  readonly spl: PublicKey
  readonly amount: BN
  readonly transaction: string
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
    borsh.publicKey('submitter'),
    borsh.publicKey('nft'),
    borsh.u8('receiverStatus'),
    borsh.u8('senderStatus'),
    borsh.publicKey('spl'),
    borsh.u64('amount'),
    borsh.str('transaction'),
    borsh.str('tags'),
    borsh.str('image'),
    borsh.str('title'),
    borsh.str('subtitle'),
  ])

  constructor(fields: ProposalFields) {
    this.receiver = fields.receiver
    this.sender = fields.sender
    this.submitter = fields.submitter
    this.nft = fields.nft
    this.receiverStatus = fields.receiverStatus
    this.senderStatus = fields.senderStatus
    this.spl = fields.spl
    this.amount = fields.amount
    this.transaction = fields.transaction
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
      submitter: dec.submitter,
      nft: dec.nft,
      receiverStatus: dec.receiverStatus,
      senderStatus: dec.senderStatus,
      spl: dec.spl,
      amount: dec.amount,
      transaction: dec.transaction,
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
      submitter: this.submitter.toString(),
      nft: this.nft.toString(),
      receiverStatus: this.receiverStatus,
      senderStatus: this.senderStatus,
      spl: this.spl.toString(),
      amount: this.amount.toString(),
      transaction: this.transaction,
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
      submitter: new PublicKey(obj.submitter),
      nft: new PublicKey(obj.nft),
      receiverStatus: obj.receiverStatus,
      senderStatus: obj.senderStatus,
      spl: new PublicKey(obj.spl),
      amount: new BN(obj.amount),
      transaction: obj.transaction,
      tags: obj.tags,
      image: obj.image,
      title: obj.title,
      subtitle: obj.subtitle,
    })
  }
}
