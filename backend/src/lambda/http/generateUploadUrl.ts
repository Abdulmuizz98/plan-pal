import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl, updateUrl } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('Todos');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing events: ', event)
    const userId = await getUserId(event);
    const todoId = event.pathParameters.todoId
    // DONE: Return a presigned URL to upload a file for a TODO item with the provided id

    await updateUrl(userId, todoId)
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
