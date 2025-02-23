import { Call } from "starknet";
export interface ChipiSDKConfig {
    apiKey: string;
    rpcUrl: string;
    argentClassHash: string;
    contractAddress: string;
    contractEntryPoint?: string;
}
export interface WalletData {
    publicKey: string;
    encryptedPrivateKey: string;
}
export interface TransferParams {
    recipient: string;
    amount: string | number;
    decimals?: number;
}
export interface IncrementParams {
}
export type TransactionParams = {
    type: 'transfer' | 'approve';
    params: TransferParams;
} | {
    type: 'wildcard';
    params: IncrementParams;
};
export interface SimpleTransactionInput {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    calls: Call[];
}
export interface TransactionInput {
    pin: string;
    wallet: WalletData;
    calls: Call[];
}
export interface TransactionResult {
    success: boolean;
    accountAddress: string;
    encryptedPrivateKey: string;
    txHash: string;
}
