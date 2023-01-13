import { Button } from 'components/Button'
import { useGrantActions } from 'hooks/useGrantActions'
import { useState } from 'react'
import { GrantDetail } from 'types/grant'

interface Props {
  grant: GrantDetail
}

export const ApproveAndRejectGrantButton = ({ grant }: Props) => {
  const { approveGrant, rejectGrant } = useGrantActions(grant)
  const [loadingText, setLoadingText] = useState('')

  const handleApprove = () => {
    setLoadingText('Approving...')
    approveGrant(undefined, () => setLoadingText(''))
  }
  const handleReject = () => {
    setLoadingText('Rejecting...')
    rejectGrant(undefined, () => setLoadingText(''))
  }

  return loadingText ? (
    <Button appearance="link" size="md" className="text-purple-600" disabled>
      {loadingText}
    </Button>
  ) : (
    <>
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={handleApprove}
      >
        Approve
      </Button>
      {' / '}
      <Button
        appearance="link"
        size="md"
        className="text-purple-600"
        onClick={handleReject}
      >
        Reject
      </Button>
    </>
  )
}
