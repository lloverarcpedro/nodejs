"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const fabric_network_1 = require("fabric-network");
const fs_1 = __importDefault(require("fs"));
// Constants for profile
const CONNECTION_PROFILE_PATH = '/app/src/controllers/v1/profiles/dev-harvx-connection.json';
// Path to the wallet
const FILESYSTEM_WALLET_PATH = '/app/wallet';
// Identity context used
let USER_ID = 'admin';
// Channel name
const NETWORK_NAME = 'grainchainchannel';
// Chaincode
const CONTRACT_ID = 'gocc1';
let logData = JSON.parse('{}');
const invokeCC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Create an instance of the gatway
        const { destination, amount } = req.body;
        const origin = req.sessionData.username;
        //USER_ID = 'Admin@harvx.io'
        USER_ID = req.sessionData.email;
        console.log('origin: ', origin);
        if (!destination) {
            throw new Error('missing parameter destination name');
        }
        if (!amount) {
            throw new Error('missing parameter amount to send');
        }
        const gateway = new fabric_network_1.Gateway();
        yield main(gateway, origin, destination, amount);
        res.send({
            status: 'OK',
            data: logData
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        });
    }
});
const queryCC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        USER_ID = req.sessionData.email;
        const origin = req.sessionData.username;
        console.log('from', origin);
        const gateway = new fabric_network_1.Gateway();
        const result = yield balanceInquiry(gateway, origin);
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        });
    }
});
function main(gateway, origin, destination, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        // 2. Setup the gateway object
        yield setupGateway(gateway);
        // 3. Get the network
        const network = yield gateway.getNetwork(NETWORK_NAME);
        //console.log(network)
        // 5. Get the contract
        const contract = yield network.getContract(CONTRACT_ID);
        // console.log(contract)
        // 6. Query the chaincode
        yield queryContract(contract, origin);
        // 7. Execute the transaction
        yield submitTxnContract(contract, origin, destination, amount);
        // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
        // await submitTxnContract(contract)
        //8. Query john & Sam
        yield queryContract(contract, origin);
        yield queryContract(contract, destination);
        // 9. submitTxnTransaction
        yield submitTxnTransaction(contract, origin, destination, amount);
        logData = yield queryContract(contract, origin);
    });
}
function balanceInquiry(gateway, origin) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setupGateway(gateway);
        const network = yield gateway.getNetwork(NETWORK_NAME);
        const contract = yield network.getContract(CONTRACT_ID);
        return yield queryContract(contract, origin);
    });
}
/**
 * Queries the chaincode
 * @param {object} contract
 */
function queryContract(contract, personName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the chaincode
            const response = yield contract.evaluateTransaction('query', personName);
            const result = `Query Response=${response.toString()}`;
            console.log(`${result}`);
            return JSON.parse(response.toString());
        }
        catch (e) {
            console.log(e);
            return JSON.parse(`{"error":"${e}"}`);
        }
    });
}
/**
 * Submit the transaction
 * @param {object} contract
 */
function submitTxnContract(contract, origin, destination, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Submit the transaction
            const response = yield contract.submitTransaction('invoke', origin, destination, amount);
            console.log('Submit Responseee=', response.toString());
        }
        catch (e) {
            // fabric-network.TimeoutError
            console.log(e);
        }
    });
}
/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
function setupGateway(gateway) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 2.1 load the connection profile into a JS object
        const connectionProfile = (_a = JSON.parse(fs_1.default.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'))) !== null && _a !== void 0 ? _a : '';
        // 2.2 Need to setup the user credentials from wallet
        const wallet = new fabric_network_1.FileSystemWallet(FILESYSTEM_WALLET_PATH);
        // 2.3 Set up the connection options
        const connectionOptions = {
            identity: USER_ID,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
            /*** Uncomment lines below to disable commit listener on submit ****/
            ,
            eventHandlerOptions: {
                strategy: null
            }
            // ,eventHandlerOptions: {
            //     strategy: EventStrategies.NETWORK_SCOPE_ANYFORTX,
            //     commitTimeout: 10
            //     }
        };
        // 2.4 Connect gateway to the network
        yield gateway.connect(connectionProfile, connectionOptions);
    });
}
/**
 * Creates the transaction & uses the submit function
 * Solution to exercise
 * To execute this add the line in main() => submitTxnTransaction(contract)
 * @param {object} contract
 */
function submitTxnTransaction(contract, origin, destination, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        // Provide the function name
        const txn = contract.createTransaction('invoke');
        // Get the name of the transaction
        console.log(txn.getName());
        // Get the txn ID
        //console.log(txn.getTransactionId())
        // Submit the transaction
        try {
            const response = yield txn.submit(origin, destination, amount);
            console.log('ransaction.submit()=', response.toString());
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.default = { invokeCC, queryCC };
