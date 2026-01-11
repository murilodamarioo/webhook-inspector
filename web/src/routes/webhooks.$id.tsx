import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { SectionDataTable } from '../components/section-data-table'
import { SectionTitle } from '../components/section-title'

import { CodeBlock } from '../components/ui/code-block'
import { WebhookDetailHeader } from '../components/webhook-detail-header'

import { webhookDetailsSchema } from '../http/schemas/webhooks'
import { WebhookDetails } from '../components/webhook-details'
import { Suspense } from 'react'

export const Route = createFileRoute('/webhooks/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <WebhookDetails id={id}/>
    </Suspense>
  )
}
