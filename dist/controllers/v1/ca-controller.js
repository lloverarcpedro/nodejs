"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const fabric_client_1 = require("fabric-client");
const fabric_network_1 = require("fabric-network");
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
// Constants for profile
const CONNECTION_PROFILE_PATH = '/app/src/controllers/v1/profiles/dev-harvx-connection.json';
const ccpPath = path.resolve(CONNECTION_PROFILE_PATH);
//### Create the connection profile.
const ccp = JSON.parse(fs_1.default.readFileSync(ccpPath, 'utf8')); //Create the connection profile
//###Creates ca server connection
const caURL = ccp.certificateAuthorities['cert-auth.grainchain.io'].url;
const caConnect = new fabric_ca_client_1.default(caURL);
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new fabric_network_1.FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
const enrollAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check to see if we've already enrolled the admin user.
        const adminExists = yield wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            throw new Error('Admin user already enrolled');
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = yield caConnect.enroll({ enrollmentID: 'admingc', enrollmentSecret: 'gc2020bc' });
        const identity = fabric_network_1.X509WalletMixin.createIdentity('GrainchainMSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        res.send({
            status: 'OK',
            data: caURL
        });
        console.log(caURL);
    }
    catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        });
        console.log('error', error.message);
    }
});
const enrollUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role, affiliation } = req.body;
        console.log('Enrolling new user', email);
        // Check to see if we've already enrolled the admin user.
        const adminExists = yield wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" need to be registered before enrolling other user');
            throw new Error('Enrolle admin user first');
        }
        // Check to see if we've already enrolled this user.
        const userExists = yield wallet.exists(email);
        if (userExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            throw new Error(`${email} user already enrolled`);
        }
        //### Create the connection profile.
        const ccp = JSON.parse(fs_1.default.readFileSync(ccpPath, 'utf8')); //Create the connection profile
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        yield gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
        const wlletlist = yield wallet.list();
        console.log('Wallet list: ', wlletlist);
        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        const secret = yield caConnect.register({ affiliation: affiliation, enrollmentID: email, role: role !== null && role !== void 0 ? role : 'user', enrollmentSecret: password, maxEnrollments: -1 }, adminIdentity);
        if (!secret) {
            throw new Error(`${email} enrollement error`);
        }
        const enrollment = yield ca.enroll({ enrollmentID: email, enrollmentSecret: password });
        const mspID = affiliation == 'orderer' ? 'OrdererMSP' : 'GrainchainMSP';
        const identity = fabric_network_1.X509WalletMixin.createIdentity(mspID, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(email, identity);
        console.log(`Successfully enrolled ${email} user and imported it into the wallet`);
        res.send({
            status: 'OK',
            data: identity
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        });
        console.log('error', error.message);
    }
});
const reenroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role, affiliation } = req.body;
        console.log('Reenrolling user', email);
        // Check to see if we've already enrolled the admin user.
        const adminExists = yield wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" need to be registered before enrolling other user');
            throw new Error('Enrolle admin user first');
        }
        // Check to see if we've already enrolled this user.
        const userExists = yield wallet.exists(email);
        if (userExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            throw new Error(`${email} user already enrolled`);
        }
        //### Create the connection profile.
        const ccp = JSON.parse(fs_1.default.readFileSync(ccpPath, 'utf8')); //Create the connection profile
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        yield gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
        const wlletlist = yield wallet.list();
        console.log('Wallet list: ', wlletlist);
        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const reenrollUSer = new fabric_client_1.User({
            enrollmentID: email,
            name: username,
            roles: role
        });
        let enrollment = yield ca.enroll({ enrollmentID: email, enrollmentSecret: password });
        if (!enrollment) {
            enrollment = yield ca.reenroll(reenrollUSer, []);
        }
        const mspID = affiliation == 'orderer' ? 'OrdererMSP' : 'GrainchainMSP';
        const identity = fabric_network_1.X509WalletMixin.createIdentity(mspID, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(email, identity);
        console.log(`Successfully reenrolled ${email} user and imported it into the wallet`);
        res.send({
            status: 'OK',
            data: identity
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: error.message
        });
        console.log('error', error.message);
    }
});
exports.default = { enrollAdmin, enrollUser, reenroll };
