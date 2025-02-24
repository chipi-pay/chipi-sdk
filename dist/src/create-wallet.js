"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArgentWallet = void 0;
const gasless_sdk_1 = require("@avnu/gasless-sdk");
const starknet_1 = require("starknet");
const encryption_1 = require("./lib/encryption");
const createArgentWallet = async (params) => {
    try {
        const provider = new starknet_1.RpcProvider({
            nodeUrl: params.rpcUrl,
        });
        // Generating the private key with Stark Curve
        const privateKeyAX = starknet_1.stark.randomAddress();
        const starkKeyPubAX = starknet_1.ec.starkCurve.getStarkKey(privateKeyAX);
        // Using Argent X Account v0.4.0 class hash
        // POR REVISAR: CLASSHASH ES EL MISMO EN MAINNET?
        const accountClassHash = params.argentClassHash || "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";
        // Calculate future address of the ArgentX account
        const axSigner = new starknet_1.CairoCustomEnum({ Starknet: { pubkey: starkKeyPubAX } });
        // Set the dApp Guardian address
        const axGuardian = new starknet_1.CairoOption(starknet_1.CairoOptionVariant.None);
        const AXConstructorCallData = starknet_1.CallData.compile({
            owner: axSigner,
            guardian: axGuardian,
        });
        const contractAddress = starknet_1.hash.calculateContractAddressFromHash(starkKeyPubAX, accountClassHash, AXConstructorCallData, 0);
        // Initiating Account
        const account = new starknet_1.Account(provider, contractAddress, privateKeyAX);
        console.log("Account ", { ...account });
        const initialValue = [
            {
                contractAddress: params.contractAddress || "0x05039371eb9f5725bb3012934b8821ff3eb3b48cbdee3a29f798c17e9a641544",
                entrypoint: params.contractEntryPoint || "get_counter",
                calldata: [contractAddress],
            },
        ];
        const typeData = await (0, gasless_sdk_1.fetchBuildTypedData)(contractAddress, initialValue, undefined, undefined, { baseUrl: params.network === "mainnet" ? gasless_sdk_1.BASE_URL : gasless_sdk_1.SEPOLIA_BASE_URL, apiKey: params.options.apiKey }, accountClassHash);
        const userSignature = await account.signMessage(typeData);
        const deploymentData = {
            class_hash: accountClassHash,
            salt: starkKeyPubAX,
            unique: `${starknet_1.num.toHex(0)}`,
            calldata: AXConstructorCallData.map((value) => starknet_1.num.toHex(value)),
        };
        const executeTransaction = await (0, gasless_sdk_1.fetchExecuteTransaction)(contractAddress, JSON.stringify(typeData), userSignature, params.options, deploymentData);
        const encryptedPrivateKey = (0, encryption_1.encryptPrivateKey)(privateKeyAX, params.pin);
        console.log("Encrypted private key: ", encryptedPrivateKey);
        // Now lets save the wallet in clerk public metadata
        /* await saveWallet({
          contractAddress: contractAddress as `0x${string}`,
          encryptedPrivateKey: encryptPrivateKey(privateKeyAX, params.pin),
        });
        console.log(
          `Wallet created successfully with txHash: ${executeTransaction.transactionHash}`,
        ); */
        // TODO: Guardar la wallet en dashboard
        console.log("Wallet created successfully with txHash: ", executeTransaction.transactionHash);
        console.log("Account address: ", contractAddress);
        return { success: true, accountAddress: contractAddress, encryptedPrivateKey, txHash: executeTransaction.transactionHash };
    }
    catch (error) {
        console.error("Error detallado:", error);
        if (error instanceof Error && error.message.includes('SSL')) {
            throw new Error("Error de conexión SSL. Intenta usando NODE_TLS_REJECT_UNAUTHORIZED=0 o verifica la URL del RPC");
        }
        throw new Error(`Error creating Argent wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.createArgentWallet = createArgentWallet;
