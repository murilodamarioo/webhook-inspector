import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { inArray } from 'drizzle-orm'

import z from 'zod'

import { webhooks } from '@/db/schema'
import { db } from '@/db'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a Typescript handler',
        tags: ['Webhooks'],
        body: z.object({
          webhookIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body

      const result = await db
        .select({ body: webhooks.body })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds))

      const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n')

      return reply.status(201).send({ code: webhooksBodies })
    },
  )
}
