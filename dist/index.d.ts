import type { ChipiSDKConfig, TransactionInput, TransactionResult, WalletData, SimpleTransactionInput } from "./src/types";
export declare class ChipiSDK {
    private options;
    private rpcUrl;
    private argentClassHash;
    private contractAddress;
    private contractEntryPoint;
    private network;
    constructor(config: ChipiSDKConfig);
    createWallet(pin: string): Promise<TransactionResult>;
    private formatAmount;
    executeTransaction(input: SimpleTransactionInput): Promise<string | null>;
    transfer(params: {
        pin: string;
        wallet: WalletData;
        contractAddress: string;
        recipient: string;
        amount: string | number;
        decimals?: number;
    }): Promise<string | null>;
    approve(params: {
        pin: string;
        wallet: WalletData;
        contractAddress: string;
        spender: string;
        amount: string | number;
        decimals?: number;
    }): Promise<string | null>;
    stake(params: {
        pin: string;
        wallet: WalletData;
        contractAddress: string;
        amount: string | number;
        recipient: string;
        decimals?: number;
    }): Promise<string | null>;
    withdraw(params: {
        pin: string;
        wallet: WalletData;
        contractAddress: string;
        amount: string | number;
        decimals?: number;
        recipient: string;
    }): Promise<string | null>;
    vote(params: {
        pin: string;
        wallet: WalletData;
        contractAddress: string;
        proposalId: string;
        vote: string;
    }): Promise<string | null>;
}
export type { ChipiSDKConfig, TransactionInput, TransactionResult };
