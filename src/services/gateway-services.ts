import { Gateway, FileSystemWallet, Contract } from 'fabric-network'
import fs from 'fs'

// Constants for profile
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/src/controllers/v1/profiles/dev-harvx-connection.json'
// Path to the wallet
const FILESYSTEM_WALLET_PATH = '/Users/pedrollovera/Documents/Curso-NodeJS/wallet'

const gateway = new Gateway()

const getContract = async (networkName: string, contractId: string, userId: string, contractName : string): Promise<Contract> => {


    // 1. Setup the gateway object
    await setupGateway(gateway, userId)

    // 2. Get the network
    const network = await gateway.getNetwork(networkName)
    //console.log(network)

    // 3. Get the contract
    const contract = await network.getContract(contractId, contractName)
    // console.log(contract)

    return contract
}

/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
async function setupGateway(gateway: Gateway, userId: string) {

    // 1.1 load the connection profile into a JS object
    const connectionProfile = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8')) ?? ''

    // 1.2 Need to setup the user credentials from wallet
    const wallet = new FileSystemWallet(FILESYSTEM_WALLET_PATH)

    // 1.3 Set up the connection options
    const connectionOptions = {
        identity: userId,
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

    // 1.4 Connect gateway to the network
    await gateway.connect(connectionProfile, connectionOptions)
}

export { getContract }