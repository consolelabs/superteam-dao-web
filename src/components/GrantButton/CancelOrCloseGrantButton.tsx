import { Button } from 'components/Button'
import { useGrantActions } from 'hooks/useGrantActions'
import { useState } from 'react'
import { GrantDetail } from 'types/grant'

interface Props {
  type: 'cancel' | 'close'
  grant: GrantDetail
}

export const CancelOrCloseGrantButton = ({ type, grant }: Props) => {
  const { cancelGrant, closeGrant } = useGrantActions(grant)
  const [loading, setLoading] = useState(false)

  const text = type === 'cancel' ? 'Cancel' : 'Close'
  const loadingText = type === 'cancel' ? 'Canceling...' : 'Closing...'
  const action = type === 'cancel' ? cancelGrant : closeGrant
  const handleClick = () => {
    setLoading(true)
    action(undefined, () => setLoading(false))
  }

  return (
    <Button
      appearance="link"
      size="md"
      className="text-purple-600"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? loadingText : text}
    </Button>
  )
}
