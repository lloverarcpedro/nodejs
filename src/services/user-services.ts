import {IUser} from '../mongo/models/users-model'
import models from '../mongo/models/users-model'

const getUsers = async function (query: string) : Promise<IUser[]>{

    try {
        const users = await models.find({username:query})
        return users
    } catch (e) {
        // Log Errors
        throw Error('Error while listing Users')
    }
}

const createUser = async function (user: IUser): Promise<IUser> {

    try{
        const userCreated = models.create(user)
        return userCreated
    }catch(error){
        throw Error('Error while creating Users')
    }  
}

export {getUsers, createUser}