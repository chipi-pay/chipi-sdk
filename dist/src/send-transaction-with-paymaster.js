"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePaymasterTransaction = void 0;
const gasless_sdk_1 = require("@avnu/gasless-sdk");
const starknet_1 = require("starknet");
const encryption_1 = require("./lib/encryption");
const executePaymasterTransaction = async (params) => {
    try {
        const { pin, wallet, calls, rpcUrl, options } = params;
        console.log("Params: ", params);
        // Fetch the encrypted private key from clerk public metadata
        const privateKeyDecrypted = (0, encryption_1.decryptPrivateKey)(wallet.encryptedPrivateKey, pin);
        if (!privateKeyDecrypted) {
            throw new Error("Failed to decrypt private key");
        }
        const provider = new starknet_1.RpcProvider({
            nodeUrl: rpcUrl,
        });
        const accountAX = new starknet_1.Account(provider, wallet.publicKey, privateKeyDecrypted);
        // Build the type data
        const typeData = await (0, gasless_sdk_1.fetchBuildTypedData)(wallet.publicKey, calls, undefined, undefined, options);
        // Sign the message
        const userSignature = await accountAX.signMessage(typeData);
        // Execute the transaction
        const executeTransaction = await (0, gasless_sdk_1.fetchExecuteTransaction)(wallet.publicKey, JSON.stringify(typeData), userSignature, options);
        return executeTransaction.transactionHash;
    }
    catch (error) {
        console.error("Error sending transaction with paymaster", error);
        return null;
    }
};
exports.executePaymasterTransaction = executePaymasterTransaction;
