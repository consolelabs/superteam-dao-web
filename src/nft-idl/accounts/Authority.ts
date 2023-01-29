import { PublicKey, Connection } from '@solana/web3.js'
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface AuthorityFields {
  owner: PublicKey
}

export interface AuthorityJSON {
  owner: string
}

export class Authority {
  readonly owner: PublicKey

  static readonly discriminator = Buffer.from([
    36, 108, 254, 18, 167, 144, 27, 36,
  ])

  static readonly layout = borsh.struct([borsh.publicKey('owner')])

  constructor(fields: AuthorityFields) {
    this.owner = fields.owner
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
  ): Promise<Authority | null> {
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
  ): Promise<Array<Authority | null>> {
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

  static decode(data: Buffer): Authority {
    if (!data.slice(0, 8).equals(Authority.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = Authority.layout.decode(data.slice(8))

    return new Authority({
      owner: dec.owner,
    })
  }

  toJSON(): AuthorityJSON {
    return {
      owner: this.owner.toString(),
    }
  }

  static fromJSON(obj: AuthorityJSON): Authority {
    return new Authority({
      owner: new PublicKey(obj.owner),
    })
  }
}
