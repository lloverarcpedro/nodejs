/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import Users from '../mongo/models/users-model'

const isValidHostname = (req: Request, res: Response, next: NextFunction) => {
    const validHosts = ['localhost', 'grainchain.io']
    if (validHosts.includes(req.hostname)) {
        next()
    } else {
        res.status(403).send({ status: 'Access denied' })
    }
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.headers', req.headers)
    try {
        const token = req.headers.token
        if (token) {
            const data: any = jwt.verify(token as string, process.env.JWT_SECRET!)
            const user = await Users.findOne({ _id: data.userId })
            req.sessionData = { userId: data.userId, role: data.role, email: user?.email, username: user?.username }
            next()
        } else {
            throw {
                code: 403,
                status: 'Access denied',
                message: 'Missing header token',
            }
        }
    } catch (error) {
        res
            .status(error.code || 500)
            .send({ status: 'Error', message: error.message })
    }
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.sessionData
        console.log('isAdmin', role)
        if (role != 'admin')
            throw {
                code: 403,
                status: 'Access denied',
                message: 'Admin Only',
            }
        next()
    } catch (error) {
        res
            .status(error.code || 500)
            .send({ status: 'Error', message: error.message })
    }
}

const validateRole = (requiredRole: string) => {
    const middelware = async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.sessionData
            console.log('role received', role)
            if (role != requiredRole)
                throw {
                    code: 403,
                    status: 'Access denied',
                    message: `${requiredRole} only`,
                }
            next()
        } catch (error) {
            res
                .status(error.code || 500)
                .send({ status: 'Error', message: error.message })
        }
    }
    return middelware
}

export { isValidHostname, isAuth, isAdmin, validateRole }
