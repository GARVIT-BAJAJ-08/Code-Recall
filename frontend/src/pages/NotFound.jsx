import { Compass } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg pt-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="That page doesn't exist. Head back to the home page."
        action={<Button to="/">Back to home</Button>}
      />
    </div>
  )
}
