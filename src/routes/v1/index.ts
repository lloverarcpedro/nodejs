/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import productsRoutes from './products-routes'
import usersRoutes from '../v1/users-routes'
import ccRoutes from '../v1/cc-routes'
import grainchainRoutes from '../v1/grainchain-routes'
import {Application} from 'express'

export default (app: Application) => {
    app.use('/api/v1/users', usersRoutes)
    app.use('/api/v1/products', productsRoutes)
    app.use('/api/v1/cc', ccRoutes)
    app.use('/api/v1/grainchain', grainchainRoutes)
}