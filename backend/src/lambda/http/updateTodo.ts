import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('Todos');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing events: ', event)

    const todoId = event.pathParameters.todoId
    const userId = await getUserId(event);
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateTodo(todoId, userId, updatedTodo)

    return {
      statusCode: 201,
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
