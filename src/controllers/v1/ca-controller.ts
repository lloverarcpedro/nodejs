import FabricCAServices from 'fabric-ca-client'
import { User } from 'fabric-client'
import { FileSystemWallet, X509WalletMixin, Gateway } from 'fabric-network'
import { Request, Response } from 'express'
import fs from 'fs'
import * as path from 'path'

// Constants for profile
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/src/controllers/v1/profiles/dev-harvx-connection.json'
const ccpPath = path.resolve(CONNECTION_PROFILE_PATH)

//### Create the connection profile.
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')) //Create the connection profile
//###Creates ca server connection
const caURL = ccp.certificateAuthorities['cert-auth.grainchain.io'].url
const caConnect = new FabricCAServices(caURL)

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet')
const wallet = new FileSystemWallet(walletPath)
console.log(`Wallet path: ${walletPath}`)

const enrollAdmin = async (req: Request, res: Response) => {
    try {

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin')
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet')
            throw new Error('Admin user already enrolled')
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await caConnect.enroll({ enrollmentID: 'admingc', enrollmentSecret: 'gc2020bc' })
        const identity = X509WalletMixin.createIdentity('GrainchainMSP', enrollment.certificate, enrollment.key.toBytes())
        wallet.import('admin', identity)
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet')
        res.send({
            status: 'OK',
            data: caURL
        })
        console.log(caURL)
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        })
        console.log('error', error.message)
    }

}

const enrollUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, affiliation } = req.body
        console.log('Enrolling new user', email)

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin')
        if (!adminExists) {
            console.log('An identity for the admin user "admin" need to be registered before enrolling other user')
            throw new Error('Enrolle admin user first')
        }

        // Check to see if we've already enrolled this user.
        const userExists = await wallet.exists(email)
        if (userExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet')
            throw new Error(`${email} user already enrolled`)
        }

        //### Create the connection profile.
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')) //Create the connection profile

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()

        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } })

        const wlletlist = await wallet.list()
        console.log('Wallet list: ', wlletlist)

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority()

        const adminIdentity = gateway.getCurrentIdentity()
        const secret = await caConnect.register({ affiliation: affiliation, enrollmentID: email, role: role ?? 'user', enrollmentSecret: password, maxEnrollments: -1 }, adminIdentity)
        if (!secret) {
            throw new Error(`${email} enrollement error`)
        }
        const enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: password })
        const mspID = affiliation == 'orderer' ? 'OrdererMSP' : 'GrainchainMSP'
        const identity = X509WalletMixin.createIdentity(mspID, enrollment.certificate, enrollment.key.toBytes())
        wallet.import(email, identity)
        console.log(`Successfully enrolled ${email} user and imported it into the wallet`)

        res.send({
            status: 'OK',
            data: identity
        })

    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        })
        console.log('error', error.message)
    }
}

const reenroll = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, affiliation } = req.body
        console.log('Reenrolling user', email)
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin')
        if (!adminExists) {
            console.log('An identity for the admin user "admin" need to be registered before enrolling other user')
            throw new Error('Enrolle admin user first')
        }

        // Check to see if we've already enrolled this user.
        const userExists = await wallet.exists(email)
        if (userExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet')
            throw new Error(`${email} user already enrolled`)
        }

        //### Create the connection profile.
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')) //Create the connection profile

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()

        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } })

        const wlletlist = await wallet.list()
        console.log('Wallet list: ', wlletlist)

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority()
        
        const reenrollUSer: User = new User({
            enrollmentID: email,
            name: username,
            roles: role
        })
        
        let enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: password })
       
        if(!enrollment){
            enrollment = await ca.reenroll(reenrollUSer, [])
        }
        
        const mspID = affiliation == 'orderer' ? 'OrdererMSP' : 'GrainchainMSP'
        const identity = X509WalletMixin.createIdentity(mspID, enrollment.certificate, enrollment.key.toBytes())
        wallet.import(email, identity)
        console.log(`Successfully reenrolled ${email} user and imported it into the wallet`)

        res.send({
            status: 'OK',
            data: identity
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        })
        console.log('error', error.message)
    }
}

export default { enrollAdmin, enrollUser, reenroll }