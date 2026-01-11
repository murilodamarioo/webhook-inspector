
import { db } from './index'
import { webhooks } from './schema'
import { faker } from '@faker-js/faker'

const stripeEvents = [
  'payment_intent.succeeded',
  'payment_intent.failed',
  'payment_intent.created',
  'invoice.created',
  'invoice.finalized',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'charge.succeeded',
  'charge.failed',
  'charge.refunded',
  'checkout.session.completed',
  'checkout.session.expired',
  'subscription.created',
  'subscription.updated',
  'subscription.deleted',
  'payout.paid',
  'payout.failed',
]

function randomStripeEvent() {
  return stripeEvents[Math.floor(Math.random() * stripeEvents.length)]
}

function randomPathname(event: string) {
  return `/stripe/webhook/${event.replace(/\./g, '-')}`
}

function randomBody(event: string) {
  return JSON.stringify({
    id: faker.string.uuid(),
    object: 'event',
    type: event,
    data: {
      object: {
        id: faker.string.uuid(),
        amount: faker.number.int({ min: 100, max: 100000 }),
        currency: 'usd',
        status: faker.helpers.arrayElement(['succeeded', 'failed', 'pending']),
        customer: faker.string.uuid(),
        created: faker.date.past().getTime() / 1000,
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: { id: faker.string.uuid(), idempotency_key: faker.string.uuid() },
    api_version: '2024-01-01',
  }, null, 2)
}

function randomHeaders() {
  return {
    'content-type': 'application/json',
    'user-agent': faker.internet.userAgent(),
    'stripe-signature': faker.string.uuid(),
  }
}

function randomQueryParams() {
  return {
    session_id: faker.string.uuid(),
    customer_id: faker.string.uuid(),
  }
}

async function seed() {
  await db.delete(webhooks)

  const records = Array.from({ length: 60 }, () => {
    const event = randomStripeEvent()
    return {
      method: 'POST',
      pathname: randomPathname(event),
      ip: faker.internet.ip(),
      statusCode: 200,
      contentType: 'application/json',
      contentLength: faker.number.int({ min: 100, max: 10000 }),
      queryParams: randomQueryParams(),
      headers: randomHeaders(),
      body: randomBody(event),
      createdAt: faker.date.recent({ days: 30 }),
    }
  })

  await db.insert(webhooks).values(records)
  console.log('✅ Seeded 60 Stripe webhooks!')
}

seed()