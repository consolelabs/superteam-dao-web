import { WithChildren } from 'types/common'
import { Header } from 'components/Header'

export const Layout = ({ children }: WithChildren) => {
  return (
    <div className="bg-[#121217] min-h-screen text-white">
      <Header />
      <main className="container mx-auto">
        <div className="px-8 py-6">
          <div className="flex space-y-6 flex-col max-w-7xl w-full mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
