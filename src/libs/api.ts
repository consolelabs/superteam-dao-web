import { raydiumMainnetTokenListUrl } from 'hooks/solana/useTokenList'
import { User } from 'types/schema'
import { RaydiumTokenListJsonInfo } from 'types/solana'
import fetcher from './fetcher'

// eslint-disable-next-line prefer-destructuring
const BASE_URL = process.env.BASE_URL

class Client {
  headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  getUsers() {
    return fetcher<User[]>(`${BASE_URL}/users`, {
      headers: this.headers,
    })
  }

  getTokenList() {
    return fetcher<RaydiumTokenListJsonInfo>(raydiumMainnetTokenListUrl, {
      headers: this.headers,
    })
  }

  getTransaction(id: string) {
    return fetcher(`https://public-api.solscan.io/transaction/${id}`, {
      headers: this.headers,
    })
  }
}

const client = new Client()

export { client }
