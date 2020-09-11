/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Gateway, FileSystemWallet, Contract } from 'fabric-network'
import { Request, Response } from 'express'
import fs from 'fs'
// Used for parsing the connection profile YAML file
import yaml from 'js-yaml'

// Constants for profile
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/src/controllers/v1/profiles/dev-connection.yaml'
// Path to the wallet
const FILESYSTEM_WALLET_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/src/controllers/v1/user-wallet'
// Identity context used
const USER_ID = 'Admin@acme.com'
// Channel name
const NETWORK_NAME = 'airlinechannel'
// Chaincode
const CONTRACT_ID = 'erc20'
let logData = JSON.parse('{}')


const invokeCC = async (req: Request, res: Response) => {

    try {
        // 1. Create an instance of the gatway
        const { destination, amount } = req.body
        const origin = req.sessionData.username
        console.log('origin: ',origin)
        if (!destination) {
            throw new Error('missing parameter destination name')
        }
        if (!amount) {
            throw new Error('missing parameter amount to send')
        }
        const gateway = new Gateway()
        await main(gateway,origin, destination,amount)
        res.send({
            status: 'OK',
            data: logData
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }

}

const queryCC = async (req: Request, res: Response) =>{
    try{
        const origin = req.sessionData.username
        const gateway = new Gateway()
        const result = await balanceInquiry(gateway,origin)
        res.send({
            status: 'OK',
            data: result
        })
    }catch(error){
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }
}


async function main(gateway: Gateway, origin: string, destination: string, amount: string) {

    // 2. Setup the gateway object
    await setupGateway(gateway)

    // 3. Get the network
    const network = await gateway.getNetwork(NETWORK_NAME)
    //console.log(network)

    // 5. Get the contract
    const contract = await network.getContract(CONTRACT_ID)
    // console.log(contract)

    // 6. Query the chaincode
    await queryContract(contract, origin)

    // 7. Execute the transaction
    await submitTxnContract(contract, origin, destination, amount)
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
    // await submitTxnContract(contract)

    //8. Query john & Sam
    await queryContract(contract, origin)
    await queryContract(contract, destination)

    // 9. submitTxnTransaction
    await submitTxnTransaction(contract, origin, destination, amount)
    logData = await queryContract(contract, origin)
}

async function balanceInquiry(gateway: Gateway, origin: string){
    await setupGateway(gateway)
    const network = await gateway.getNetwork(NETWORK_NAME)
    const contract = await network.getContract(CONTRACT_ID)
    return await queryContract(contract, origin)
}

/**
 * Queries the chaincode
 * @param {object} contract 
 */
async function queryContract(contract: Contract, personName: string) {
    try {
        // Query the chaincode
        const response = await contract.evaluateTransaction('balanceOf', personName)
        const result = `Query Response=${response.toString()}`
        console.log(`${result}`)
        return JSON.parse(response.toString())
    } catch (e) {
        console.log(e)
        return JSON.parse(`{"error":"${e}"}`)
    }
}

/**
 * Submit the transaction
 * @param {object} contract 
 */
async function submitTxnContract(contract: Contract,origin:string, destination: string, amount: string) {
    try {
        // Submit the transaction
        const response = await contract.submitTransaction('transfer', origin, destination, amount)
        console.log('Submit Responseee=', response.toString())
    } catch (e) {
        // fabric-network.TimeoutError
        console.log(e)
    }
}

/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
async function setupGateway(gateway: Gateway) {

    // 2.1 load the connection profile into a JS object
    const connectionProfile = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8')) ?? ''

    // 2.2 Need to setup the user credentials from wallet
    const wallet = new FileSystemWallet(FILESYSTEM_WALLET_PATH)

    // 2.3 Set up the connection options
    const connectionOptions = {
        identity: USER_ID,
        wallet: wallet,
        discovery: { enabled: false, asLocalhost: true }
        /*** Uncomment lines below to disable commit listener on submit ****/
        , eventHandlerOptions: {
            strategy: null
        }
        // ,eventHandlerOptions: {
        //     strategy: EventStrategies.NETWORK_SCOPE_ANYFORTX,
        //     commitTimeout: 10
        //     }
    }

    // 2.4 Connect gateway to the network
    await gateway.connect(connectionProfile, connectionOptions)
    // console.log( gateway)
}

/**
 * Creates the transaction & uses the submit function
 * Solution to exercise
 * To execute this add the line in main() => submitTxnTransaction(contract)
 * @param {object} contract 
 */
async function submitTxnTransaction(contract: Contract,origin: string, destination: string, amount: string) {
    // Provide the function name
    const txn = contract.createTransaction('transfer')

    // Get the name of the transaction
    console.log(txn.getName())

    // Get the txn ID
    //console.log(txn.getTransactionId())

    // Submit the transaction
    try {
        const response = await txn.submit(origin, destination, amount)
        console.log('ransaction.submit()=', response.toString())
    } catch (e) {
        console.log(e)
    }
}

export default { invokeCC, queryCC }