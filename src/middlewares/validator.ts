import { body, validationResult, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'


const loginValidation = (): ValidationChain[] => {
    return [
        // username must be an email
        body('email').isEmail(), //todo CHANGE
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }),
    ]
}

const addContractValidator = (): ValidationChain[] => {

    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //buyerID not Empty
        body('buyerId').notEmpty(),
        //maxWeight not Empty
        body('maxWeight').notEmpty(),
        //commodityID not Empty
        body('commodityId').notEmpty()
    ]

}

const  createValidation = (): ValidationChain[] => {
    return [// email format
        body('email').isEmail(),
        //username
        body('username').isLength({ min: 6 }),
        //role must be seller or admin?
        body('role').isIn(['seller', 'admin']),
        //password length min 5
        body('password', 'password min length is 5').isLength({ min: 5 }),
        //data is Json
        body('data').isJSON(),
        //data  age validationd
        body('data.age').notEmpty(),
        //data is male validation
        body('data.isMale').notEmpty()
    ]
}

const validate = (req: Request, res: Response, next: NextFunction): unknown => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors: { [x: string]: unknown }[] = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

export {
    loginValidation,
    createValidation,
    addContractValidator,
    validate,
}