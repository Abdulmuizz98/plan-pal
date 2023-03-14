import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Todos');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing events: ', event)

    const todoId = event.pathParameters.todoId
    // DONE: Return a presigned URL to upload a file for a TODO item with the provided id

    const uploadUrl = await createAttachmentPresignedUrl(todoId)   

    return  {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
