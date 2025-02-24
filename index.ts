import { GaslessOptions, BASE_URL, SEPOLIA_BASE_URL } from "@avnu/gasless-sdk";
import { createArgentWallet } from "./src/create-wallet";
import { executePaymasterTransaction } from "./src/send-transaction-with-paymaster";
import type { ChipiSDKConfig, TransactionInput, TransactionResult, WalletData, SimpleTransactionInput } from "./src/types";
import { cairo } from "starknet";
import { Uint256 } from "starknet";

export class ChipiSDK {
  private options: GaslessOptions;
  private rpcUrl: string;
  private argentClassHash: string;
  private contractAddress: string;
  private contractEntryPoint: string;
  private network: "mainnet" | "sepolia";
  constructor(config: ChipiSDKConfig) {
    this.options = {
      baseUrl: config.network === "mainnet" ? BASE_URL : SEPOLIA_BASE_URL,
      apiKey: config.apiKey,
    };
    this.rpcUrl = config.rpcUrl;
    this.network = config.network;
    this.argentClassHash = config.argentClassHash;
    this.contractAddress = config.contractAddress;
    this.contractEntryPoint = config.contractEntryPoint || "get_counter";
  }

  async createWallet(pin: string): Promise<TransactionResult> {
    return createArgentWallet({
      pin,
      rpcUrl: this.rpcUrl,
      network: this.network,
      options: this.options,
      argentClassHash: this.argentClassHash,
      contractAddress: this.contractAddress,
      contractEntryPoint: this.contractEntryPoint,
    });
  }

  private formatAmount(amount: string | number, decimals: number = 18): Uint256 {
    const amountBN = typeof amount === 'string' ? 
      BigInt(amount) * BigInt(10 ** decimals) : 
      BigInt(amount) * BigInt(10 ** decimals);
    
    return cairo.uint256(amountBN);
  }

  async executeTransaction(input: SimpleTransactionInput): Promise<string | null> {
    try {
      return executePaymasterTransaction({
        ...input,
        rpcUrl: this.rpcUrl,
        options: this.options,
      });
    } catch (error) {
      console.error('Error formatting transaction:', error);
      return null;
    }
  }

  async transfer(params: {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    recipient: string;
    amount: string | number;
    decimals?: number;
  }): Promise<string | null> {
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

  async approve(params: {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    spender: string;
    amount: string | number;
    decimals?: number;
  }): Promise<string | null> {
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

  async stake(params: {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    amount: string | number;
    recipient: string;
    decimals?: number;
  }): Promise<string | null> {
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

  async withdraw(params: {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    amount: string | number;
    decimals?: number;
    recipient: string;
  }): Promise<string | null> {
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

  async vote(params: {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    proposalId: string;
    vote: string;
  }): Promise<string | null> {
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

// Export types
export type {
  ChipiSDKConfig,
  TransactionInput,
  TransactionResult
};
