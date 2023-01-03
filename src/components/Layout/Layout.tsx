import { WithChildren } from 'types/common'
import { Header } from 'components/Header'

export const Layout = ({ children }: WithChildren) => {
  return (
    <div className="bg-[#121217] min-h-screen text-white flex flex-col">
      <Header />
      <main className="container mx-auto flex flex-grow">
        <div className="px-8 py-6 min-h-full mix-w-full w-full">
          <div className="flex max-w-7xl min-h-full w-full mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
