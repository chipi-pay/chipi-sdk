"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChipiSDK = void 0;
const gasless_sdk_1 = require("@avnu/gasless-sdk");
const create_wallet_1 = require("./src/create-wallet");
const send_transaction_with_paymaster_1 = require("./src/send-transaction-with-paymaster");
const starknet_1 = require("starknet");
class ChipiSDK {
    constructor(config) {
        this.options = {
            baseUrl: config.network === "mainnet" ? gasless_sdk_1.BASE_URL : gasless_sdk_1.SEPOLIA_BASE_URL,
            apiKey: config.apiKey,
        };
        this.rpcUrl = config.rpcUrl;
        this.network = config.network;
        this.argentClassHash = config.argentClassHash;
        this.contractAddress = config.contractAddress;
        this.contractEntryPoint = config.contractEntryPoint || "get_counter";
    }
    async createWallet(pin) {
        return (0, create_wallet_1.createArgentWallet)({
            pin,
            rpcUrl: this.rpcUrl,
            network: this.network,
            options: this.options,
            argentClassHash: this.argentClassHash,
            contractAddress: this.contractAddress,
            contractEntryPoint: this.contractEntryPoint,
        });
    }
    formatAmount(amount, decimals = 18) {
        const amountBN = typeof amount === 'string' ?
            BigInt(amount) * BigInt(10 ** decimals) :
            BigInt(amount) * BigInt(10 ** decimals);
        return starknet_1.cairo.uint256(amountBN);
    }
    async executeTransaction(input) {
        try {
            return (0, send_transaction_with_paymaster_1.executePaymasterTransaction)({
                ...input,
                rpcUrl: this.rpcUrl,
                options: this.options,
            });
        }
        catch (error) {
            console.error('Error formatting transaction:', error);
            return null;
        }
    }
    async transfer(params) {
        return this.executeTransaction({
            pin: params.pin,
            wallet: params.wallet,
            contractAddress: params.contractAddress,
            calls: [{
                    contractAddress: params.contractAddress,
                    entrypoint: 'transfer',
                    calldata: [params.recipient, this.formatAmount(params.amount, params.decimals)]
                }]
        });
    }
    async approve(params) {
        return this.executeTransaction({
            pin: params.pin,
            wallet: params.wallet,
            contractAddress: params.contractAddress,
            calls: [{
                    contractAddress: params.contractAddress,
                    entrypoint: 'approve',
                    calldata: [params.spender, this.formatAmount(params.amount, params.decimals)]
                }]
        });
    }
    async stake(params) {
        return this.executeTransaction({
            pin: params.pin,
            wallet: params.wallet,
            contractAddress: params.contractAddress,
            calls: [{
                    contractAddress: params.contractAddress,
                    entrypoint: 'deposit',
                    calldata: [this.formatAmount(params.amount, params.decimals), params.recipient]
                }]
        });
    }
    async withdraw(params) {
        return this.executeTransaction({
            pin: params.pin,
            wallet: params.wallet,
            contractAddress: params.contractAddress,
            calls: [{
                    contractAddress: params.contractAddress,
                    entrypoint: 'withdraw',
                    calldata: [this.formatAmount(params.amount, params.decimals), params.recipient]
                }]
        });
    }
    async vote(params) {
        return this.executeTransaction({
            pin: params.pin,
            wallet: params.wallet,
            contractAddress: params.contractAddress,
            calls: [{
                    contractAddress: params.contractAddress,
                    entrypoint: 'vote',
                    calldata: [params.proposalId, params.vote]
                }]
        });
    }
}
exports.ChipiSDK = ChipiSDK;
