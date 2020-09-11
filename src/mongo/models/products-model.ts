import {Schema, model, Document} from 'mongoose'
import { IUser } from './users-model'

export interface IProduct extends Document {
    title: string
    desc: string
    price: number
    images: string[]
    user: IUser | string
}
const productSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        desc: { type: String, required: true },
        price: { type: String, required: true },
        images: { type: [{ type: String, required: true }], default: ['https://static.thenounproject.com/png/1375595-200.png'] },
        user: { type: Schema.Types.ObjectId, ref: 'User', require: true }
    },
    {
        timestamps: true,
    }
)

export default model<IProduct>('Product', productSchema)

// export {model}
