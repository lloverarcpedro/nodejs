/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Gateway, FileSystemWallet, Contract } from 'fabric-network'
import { Request, Response } from 'express'
import fs from 'fs'


// Constants for profile
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/src/controllers/v1/profiles/dev-harvx-connection.json'
// Path to the wallet
const FILESYSTEM_WALLET_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/wallet'
// Identity context used
const USER_ID = 'admin'
// Channel name
const NETWORK_NAME = 'grainchainchannel'
// Chaincode
const CONTRACT_ID = 'gocc1'
let logData = JSON.parse('{}')


const createContract = async (req: Request, res: Response) => {

    try {
        // 1. Create an instance of the gatway
        const { contractId, buyerId, maxWeight, commodityId } = req.body


        if (!contractId) {
            throw new Error('missing parameter contractId')
        }
        if (!buyerId) {
            throw new Error('missing parameter buyerId')
        }
        if (!maxWeight) {
            throw new Error('missing parameter maxWeight')
        }
        if (!commodityId) {
            throw new Error('missing parameter commodityId')
        }
        const gateway = new Gateway()
        await main(gateway, req)
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

const getContract = async (req: Request, res: Response) => {
    try {
        
        const contractId = req.params.id
        console.log('from', contractId)
        const gateway = new Gateway()
        const result = await getContractById(gateway, contractId)
        res.send({
            status: 'OK',
            data: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }
}


async function main(gateway: Gateway, req: Request) {

    const { contractId, buyerId, maxWeight, commodityId } = req.body

    // 2. Setup the gateway object
    await setupGateway(gateway)

    // 3. Get the network
    const network = await gateway.getNetwork(NETWORK_NAME)
    //console.log(network)

    // 5. Get the contract
    const contract = await network.getContract(CONTRACT_ID,'grainContract')
    // console.log(contract)

    // 6. Query the chaincode
    await queryContract(contract, contractId)

    // 7. Execute the transaction
    await submitTxnContract(contract, contractId, buyerId, maxWeight, commodityId)
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
    // await submitTxnContract(contract)

    //8. Query john & Sam
    await queryContract(contract, contractId)

    // 9. submitTxnTransaction
    await submitTxnTransaction(contract, contractId, buyerId, maxWeight, commodityId)
    logData = await queryContract(contract, contractId)
}

async function getContractById(gateway: Gateway, origin: string) {
    await setupGateway(gateway)
    const network = await gateway.getNetwork(NETWORK_NAME)
    const contract = await network.getContract(CONTRACT_ID,'grainContract')
    return await queryContract(contract, origin)
}

/**
 * Queries the chaincode
 * @param {object} contract 
 */
async function queryContract(contract: Contract, contractId: string) {
    try {
        // Query the chaincode
        const response = await contract.evaluateTransaction('getContract', contractId)
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
async function submitTxnContract(contract: Contract, contractId: string, buyerId: string, maxWeight: string, commodityId: string) {
    try {
        // Submit the transaction
        const response = await contract.submitTransaction('addContract', contractId, buyerId, maxWeight, commodityId)
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
    const connectionProfile = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8')) ?? ''

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
async function submitTxnTransaction(contract: Contract, contractId: string, buyerId: string, maxWeight: string, commodityId: string) {
    // Provide the function name
    const txn = contract.createTransaction('addContract')

    // Get the name of the transaction
    console.log(txn.getName())

    // Get the txn ID
    //console.log(txn.getTransactionId())

    // Submit the transaction
    try {
        const response = await txn.submit(contractId, buyerId, maxWeight, commodityId)
        console.log('ransaction.submit()=', response.toString())
    } catch (e) {
        console.log(e)
    }
}

export default { createContract, getContract }