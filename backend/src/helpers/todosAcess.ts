 import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor (
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(), 
        private readonly todosTable = process.env.TODOS_TABLE, 
        private readonly indexName = process.env.TODOS_CREATED_AT_INDEX){

    }

    async getAllTodos(userId: String): Promise<TodoItem[]>{
        logger.info("Getting all todos")

        const result =   await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId	
            },
          }).promise()
        
        return result.Items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem>{
        logger.info("Creating a todo with id", todo.todoId)
        
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
    
        return todo;
    }

    async updateTodo(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<Object>{
        logger.info("Updating todo: ", todoId)
        
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { 
                userId,
                todoId 
            },
            UpdateExpression: 'set #nm = :nm, dueDate = :dueDate, done = :done ',
            ExpressionAttributeValues: {
                ':nm': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#nm': 'name'
            }
        }).promise()

        return {}
    }
    async addUrl(todoId: string, url: string, userId: string): Promise<Object>{
        logger.info("Updating todo: ", todoId)
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { 
                userId,
                todoId 
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': url
            }
        }).promise()

        return {}
    }

    async deleteTodo(todoId: string, userId: string ): Promise<Object>{
        logger.info("Deleting a todo with id", todoId)
                
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { 
                userId,
                todoId
             },
        }).promise()

        return {};
    }

    
    async getATodo(todoId: string, userId:string): Promise<TodoItem>{
        logger.info("Getting a todo with id", todoId)
        
        const result =   await this.getAllTodos(userId)
        const todo = result.find(e => e.todoId === todoId)
        return todo as TodoItem 
    }


}