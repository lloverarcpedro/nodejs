import { Contract } from 'fabric-network'
import { getContract } from './gateway-services'
import { Request } from 'express'

// Identity context used
const USER_ID = 'admin'
// Channel name
const NETWORK_NAME = 'grainchainchannel'
// Chaincode
const CONTRACT_ID = 'gocc1'

//Chaincode contract name
const CONTRACT_NAME = 'grainContract'


const invokeContract = async (req: Request): Promise<string> => {

    const { contractId, buyerId, maxWeight, commodityId } = req.body

    //1 get contract from gateway services
    const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)

    // 4. Execute the transaction
    await submitTxnContract(contract, contractId, buyerId, maxWeight, commodityId)
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT

    // 5. submitTxnTransaction
    return await submitTxnTransaction(contract, contractId, buyerId, maxWeight, commodityId)

}

const getContractById = async (contractId: string): Promise<string> => {
    try {
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        //query the contract
        const response = await contract.evaluateTransaction('getContract', contractId)
        console.log(`Query Response=${response.toString()}`)
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
 * Creates the transaction & uses the submit function
 * @param {object} contract 
 */
async function submitTxnTransaction(contract: Contract, contractId: string, buyerId: string, maxWeight: string, commodityId: string) {
    // Provide the function name
    const txn = contract.createTransaction('addContract')

    // Get the name of the transaction
    console.log(txn.getName())

    // Get the txn ID
    const txnID = txn.getTransactionID().getTransactionID()
    console.log(txn.getTransactionID())

    // Submit the transaction
    try {
        const response = await txn.submit(contractId, buyerId, maxWeight, commodityId)
        console.log('Transaction.submit()=', response.toString())
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)
    } catch (e) {
        console.log(e)
    }
}

export { getContractById, invokeContract }