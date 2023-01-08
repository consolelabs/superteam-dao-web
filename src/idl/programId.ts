import { PublicKey } from '@solana/web3.js'

// Program ID defined in the provided IDL. Do not edit, it will get overwritten.
export const PROGRAM_ID_IDL = new PublicKey(
  '2kAE3hehkVtyjfwBE9mMYgzMMD4uH6s6GLVwzuK179pV',
)

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export const PROGRAM_ID: PublicKey = PROGRAM_ID_IDL
