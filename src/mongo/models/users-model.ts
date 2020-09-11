import {Schema, model, Document} from 'mongoose'

export interface IUser extends Document{
    username: string
    password: string
    email: string
    data: {
        age: number
        isMale: boolean
    }
    role: string
}

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true},
        password: { type: String, required: true, unique: true},
        email: { type: String, required: true, unique: true},
        data: {
            age: Number,
            isMale: Boolean,
        },
        role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
    },
    {
        timestamps: true,
    }
)

export default model<IUser>('User', userSchema)