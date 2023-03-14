import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'


const logger = createLogger('Todos');


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing events: ', event)
    
    const todoId = event.pathParameters.todoId
    const userId = await getUserId(event);
    // DONE: Remove a TODO item by id
    
    await deleteTodo(todoId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({})
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
