import { GaslessOptions } from "@avnu/gasless-sdk";
import { Call, Signature, TypedData } from "starknet";


export interface ChipiSDKConfig {
    apiKey: string;
    // rpcUrl: string;
    // argentClassHash: string;
  }
  
  export interface WalletData {
    publicKey: string;
    encryptedPrivateKey: string;
  }
  
  export interface TransactionResult {
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

// PAYMASTER
export interface ExecuteSponsoredTransactionParams {
    publicKey: string;
    typeData: TypedData;
    userSignature: Signature;
}

export interface PrepareTypedDataParams {
    publicKey: string;
    calls: Call[];
    
  }
