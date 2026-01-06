import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifyCors } from '@fastify/cors'
import ScalarApiRefrence from '@scalar/fastify-api-reference'

import { listWebHooks } from './routes/list-webhooks'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // credentials: true
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API for capturing and inspecting webhook requests',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiRefrence, {
  routePrefix: '/docs',
})

app.register(listWebHooks)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP server running on http://localhost:3333!')
  console.log('📚 API docs available on http://localhost:3333/docs')
})
