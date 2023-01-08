import cx from 'classnames'
import ReactHtmlParser from 'react-html-parser'
import { useDisclosure } from '@dwarvesf/react-hooks'
import { Layout } from 'components/Layout'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { IconChevronDown } from 'components/icons/components/IconChevronDown'
import { IconChevronUp } from 'components/icons/components/IconChevronUp'
import { formatWallet } from 'utils/formatWallet'
import { CopyElement } from 'components/CopyElement'

const DESCRIPTION = `Writing grant proposals can be stressful process for many
organizations. However, it's also an exciting time for your
nonprofit to secure the funds needed to deliver or expand your
services. <br />
In this article, we'll dig into successful grant proposal examples
to show how you can start winning grant funding for your
organization. By the time you finish reading this, you'll understand
the characteristics of successful proposals, examples of grant
proposals in a variety of program areas, and know exactly where you
can find more sample grant proposals for nonprofit organizations.
Ready?
<br />
Let's dig in! Why Should You Find Successful Grant Proposal
Examples? Finding Successful Grant Proposal Examples Whether you are
a seasoned grant writer or are preparing your first proposal ever,
grant writing can be an intimidating endeavor. Grant writing is like
any skill in that if you apply yourself, practice, and practice some
more, you are sure to increase your ability to write compelling
proposals. Successful grant proposals not only convey the great idea
you have for your organization but convince others to get excited
about the future you envision. Many follow similar structures and
developing a process that works best for your writing style can help
make the task of preparing proposals much easier. In addition to
showing what to and not to do, finding successful grant proposals
can help you see significant trends and structures that can help you
develop your grant writing capabilities.
<br />
What Characteristics Make a Grant Proposal Successful?
Characteristics of a Successful Grant Proposal No two grant
proposals are the same. Nor should they be. Every organization is
unique, as is every funding opportunity. That being said, there are
some shared characteristics that most successful proposals contain.
1. Successful grant proposals have a clear focus. Your first step
when searching for funds is to clearly understand why you need those
funds and what they will accomplish. Funders want to invest in
programs they believe will be successful and impactful. In your
proposals, you want to instill confidence in your organization's
commitment to the issue, dedication to the communities you serve,
and capacity to fulfill the proposed grant activities. Some
questions that you may want to consider include: Are you looking for
funds to establish a new program, launch a pilot project, or expand
an existing program? Will your proposed program be finished in a
year, or will it take multiple years to achieve your goal? Who is
involved in your program, and who will benefit from its success?
What problem will the proposed program address, and how is that
solution unique? What are the specific, tangible goals that you hope
to accomplish with the potential grant award?`

const GrantPage = () => {
  const needCollapse = DESCRIPTION.length > 1600

  const { isOpen: isOpenDescription, onToggle: onToggleDescription } =
    useDisclosure({ defaultIsOpen: !needCollapse })

  return (
    <Layout>
      <div className="w-full py-10">
        <div className="flex items-center self-top w-full mb-10">
          <img
            src="https://img-cdn.magiceden.dev/rs:fill:228:228:0:0/plain/https://bafybeibrumzlxuai3rs6sdafq24faaggprot5e7sdluolefveb576lnpnq.ipfs.nftstorage.link/5679.png?ext=png"
            alt="title"
            className="w-[8rem] h-[8rem] mr-12 rounded-full"
          />
          <Text as="h1" className="text-4xl font-bold mb-6">
            Grant title
          </Text>
          <Text as="b" className="text-lg font-bold mb-6 ml-auto">
            Approved
          </Text>
        </div>
        <div className="flex items-center mb-12">
          <Text as="b" className="text-3xl font-bold mr-32">
            Tags
          </Text>
          <ul className="flex mt-2 flex-wrap">
            {['gamefi', 'defi', 'nft'].map((tag) => (
              <li
                key={tag}
                className="inline-flex border border-slate-300 rounded-md overflow-hidden py-1 px-3 mb-2 mr-3"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Text className="text-3xl font-bold mb-4">Description</Text>
          <div
            className={cx(
              'text-lg transition-height duration-500',
              isOpenDescription || !needCollapse
                ? 'h-auto'
                : 'h-[20rem] overflow-hidden relative',
            )}
          >
            {ReactHtmlParser(DESCRIPTION)}
            {!isOpenDescription && needCollapse && (
              <div className="bg-gradient-to-b from-transparent to-slate-800 absolute inset-x-0 bottom-0 top-0">
                &nbsp;
              </div>
            )}
          </div>
          {needCollapse && (
            <div className="text-center py-4">
              <Button
                fullWidth
                size="lg"
                appearance="link"
                Icon={isOpenDescription ? IconChevronUp : IconChevronDown}
                iconPosition="right"
                onClick={onToggleDescription}
              >
                {isOpenDescription ? 'Read less' : 'Read more'}
              </Button>
            </div>
          )}
        </div>
        <div>
          <Text className="text-3xl font-bold mb-4">Transaction</Text>
          <div className="flex">
            <div className="w-1/2">
              <div className="mb-2">
                <Text as="span" className="text-lg mr-2">
                  Grant amount:
                </Text>
                <Text as="span" className="text-lg font-bold text-purple-600">
                  10000 SOL
                </Text>
              </div>
              <div className="mb-2">
                <Text as="span" className="text-lg mr-2">
                  Approver:
                </Text>
                <CopyElement
                  value="59hZKyRiX7Y6o364RinbwN8GPajBa614St4iwt7wKe1q"
                  iconClass="w-5 h-5 text-purple-600 cursor-pointer stroke-2"
                >
                  <Text as="span" className="text-lg font-bold text-purple-600">
                    {formatWallet(
                      '59hZKyRiX7Y6o364RinbwN8GPajBa614St4iwt7wKe1q',
                    )}
                  </Text>
                </CopyElement>
              </div>
              <div className="mb-2">
                <Text as="span" className="text-lg mr-2">
                  Applicant:
                </Text>
                <CopyElement
                  value="59hZKyRiX7Y6o364RinbwN8GPajBa614St4iwt7wKe1q"
                  iconClass="w-5 h-5 text-purple-600 cursor-pointer stroke-2"
                >
                  <Text as="span" className="text-lg font-bold text-purple-600">
                    {formatWallet(
                      '59hZKyRiX7Y6o364RinbwN8GPajBa614St4iwt7wKe1q',
                    )}
                  </Text>
                </CopyElement>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GrantPage
