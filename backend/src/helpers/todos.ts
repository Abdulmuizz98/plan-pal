import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import * as uuid from 'uuid'
// import * as createError from 'http-errors'
// import * as AWS from 'aws-sdk'
// import { NONAME } from 'dns';
import { getUploadUrl } from './attachmentUtils'

const todoAccess = new TodosAccess()

const bucketName = process.env.ATTACHMENT_S3_BUCKET

// DONE: Implement businessLogic
export async function getTodosForUser(userId:string): Promise<TodoItem[] >{
    const result = await todoAccess.getAllTodos(userId)
    return result;
}

export async function createTodo(userId: string, parsedBody:CreateTodoRequest ): Promise<TodoItem> {
    const createdAt = new Date().toISOString()
    const todoId = uuid.v4()

    const newTodo: TodoItem = {
        userId,
        todoId,
        createdAt,
        ...parsedBody,
        done: false,
        attachmentUrl: null
    } 
    const result = await todoAccess.createTodo(newTodo)
    return result;
}
export async function updateUrl(userId: string, todoId: string ): Promise<Object> {
    const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${todoId}`

    const result = await todoAccess.addUrl(todoId, attachmentUrl, userId)
    return result;
}

export async function updateTodo(todoId:string, userId:string,  todoUpdate:UpdateTodoRequest): Promise<Object> {
    const result = await todoAccess.updateTodo(todoId, userId, todoUpdate)
    return result;
}

export async function deleteTodo(todoId:string, userId:string): Promise<Object> {
    const result = await todoAccess.deleteTodo(todoId, userId)
    return result
}

export async function createAttachmentPresignedUrl(todoId:string): Promise<String> {
    const url = await getUploadUrl(todoId);
    return url
}
