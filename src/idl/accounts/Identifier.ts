import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface IdentifierFields {
  sender: PublicKey
  count: BN
}

export interface IdentifierJSON {
  sender: string
  count: string
}

export class Identifier {
  readonly sender: PublicKey
  readonly count: BN

  static readonly discriminator = Buffer.from([
    204, 189, 217, 160, 27, 67, 108, 181,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey('sender'),
    borsh.u64('count'),
  ])

  constructor(fields: IdentifierFields) {
    this.sender = fields.sender
    this.count = fields.count
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
  ): Promise<Identifier | null> {
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
  ): Promise<Array<Identifier | null>> {
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

  static decode(data: Buffer): Identifier {
    if (!data.slice(0, 8).equals(Identifier.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = Identifier.layout.decode(data.slice(8))

    return new Identifier({
      sender: dec.sender,
      count: dec.count,
    })
  }

  toJSON(): IdentifierJSON {
    return {
      sender: this.sender.toString(),
      count: this.count.toString(),
    }
  }

  static fromJSON(obj: IdentifierJSON): Identifier {
    return new Identifier({
      sender: new PublicKey(obj.sender),
      count: new BN(obj.count),
    })
  }
}
